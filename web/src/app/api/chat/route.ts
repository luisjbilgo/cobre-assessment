import { NextRequest, NextResponse } from 'next/server';
import { DataSource } from 'typeorm';
import { SqlDatabase } from '@langchain/classic/sql_db';
import { ChatOpenAI } from '@langchain/openai';
import { createSqlAgent, SqlToolkit } from '@langchain/classic/agents/toolkits/sql';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs'; // Force Node.js runtime for sqlite3

// Global datasource cache
let datasource: DataSource | null = null;

async function getDataSource() {
  if (datasource && datasource.isInitialized) {
    return datasource;
  }

  // Path to /tmp (writable in Vercel serverless)
  const tmpPath = path.join('/tmp', 'assessment.db');

  // Copy database to /tmp if it doesn't exist
  if (!fs.existsSync(tmpPath)) {
    // Try multiple possible source paths (depends on Vercel config)
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'assessment.db'),
      path.join(process.cwd(), '..', 'public', 'assessment.db'),
      path.join('/var/task', 'public', 'assessment.db'),
      path.join('/var/task', 'web', 'public', 'assessment.db'),
    ];

    console.log('Looking for database in possible locations...');
    console.log('process.cwd():', process.cwd());
    
    let sourcePath: string | null = null;
    for (const p of possiblePaths) {
      console.log('Checking:', p, '- exists:', fs.existsSync(p));
      if (fs.existsSync(p)) {
        sourcePath = p;
        break;
      }
    }

    if (!sourcePath) {
      // List contents of cwd to debug
      console.log('Contents of process.cwd():', fs.readdirSync(process.cwd()));
      if (fs.existsSync(path.join(process.cwd(), 'public'))) {
        console.log('Contents of public dir:', fs.readdirSync(path.join(process.cwd(), 'public')));
      }
      throw new Error(`Database file not found in any expected location. Checked: ${possiblePaths.join(', ')}`);
    }

    console.log('Found database at:', sourcePath);
    console.log('Copying database to:', tmpPath);
    fs.copyFileSync(sourcePath, tmpPath);
  }

  datasource = new DataSource({
    type: 'sqlite',
    database: tmpPath, // Use /tmp instead of /public
  });

  await datasource.initialize();
  return datasource;
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          response: "Lo siento, no tengo configurada una API Key de OpenAI. Por favor configura OPENAI_API_KEY en las variables de entorno (.env.local).",
          sql: "-- No API Key"
        }, 
        { status: 200 }
      );
    }

    const ds = await getDataSource();
    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: ds,
    });

    const model = new ChatOpenAI({
      modelName: 'gpt-4o', // Or gpt-3.5-turbo
      temperature: 0,
    });

    const toolkit = new SqlToolkit(db, model);
    const executor = createSqlAgent(model, toolkit);

    // Run the agent
    // Note: This might be slow.
    const result = await executor.invoke({ input: message });

    // Try to extract the SQL if possible (LangChain agent steps might be hidden)
    // For now, we just return the text response.
    // If we want SQL, we'd need to use a custom callback or use a simpler Chain that returns intermediate steps.
    
    return NextResponse.json({ 
      response: result.output,
      sql: "SELECT * FROM ... (SQL tracking not enabled in agent mode)" // Placeholder
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
