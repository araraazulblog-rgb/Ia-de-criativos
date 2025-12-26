```
import ScriptGenerator from "@/components/ScriptGenerator";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            IA Creative Studio
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Crie vídeos de vendas persuasivos em segundos com Inteligência Artificial.
          </p>
        </div>
        
        <ScriptGenerator />
      </div>
    </main>
  );
}
```
