"use client"
import   {useState, ChangeEvent, useEffect }  from "react";
import axios from "axios";
import {emotionConfig} from "./config"
import Spinner from "./components/Spinner";

export default function Home() {
  const defaultColor = "#cccccc"
  const [Rows,setRows] = useState(2);
  const [input,setInput] = useState("");
  const [Output,setoutput] = useState<{label : string ; score : number}[]>();
  const [loading,setLoading] = useState(false);
  const [color,setcolor] = useState(defaultColor);


  useEffect(()=>{
    handlecolor();
  },[Output]);

  useEffect(() => {
    // 
    const inputTimeout = setTimeout(() => {
      runPredictions();
    }, 1000);

    return () => clearTimeout(inputTimeout);
  }, [input])

  
  async function runPredictions(){
    if(input){
     setLoading(true);
     const res = await axios.post("api/emotion", {input});
     setoutput(res.data.fliteredResponse);
     console.log(res);
     setLoading(false);
    }
   }

  function Handleinputchange(event: ChangeEvent<HTMLTextAreaElement>): void {
    setInput(event.target.value);
    const newrows = Math.max(1,Math.ceil(event.target.scrollHeight/20));
    setRows(newrows);
  }

  function handlecolor (){
    if(Output && Output?.length >0){
      const colorkey = (Output as any[])[0].label;
      const colorhex = (emotionConfig as any)[colorkey].colorHex;
      setcolor(colorhex);
    }
  }

  return (
    <main style={{background : color + "aa"}} className="transition-all delay-300 gap-4 flex min-h-screen flex-col items-center p-24">
      <h1 className="lg:text-4xl font-mono font-semibold text-2xl tracking-tight ">🎨Paint My Mood</h1>
     <div className="border-2 p-4 rounded border-black">
        <textarea rows={Rows} onChange={Handleinputchange} 
        placeholder="Type how you feel.."
        className="resize-none outline-none block w-full text-sm placeholder-slate-600 bg-transparent" >
        </textarea>
      </div>
      <p> -- {input}</p>
      {loading ? <Spinner/> : <div className="flex flex-warap items-center justify-center gap-2">{Output?.map(({label,score})=>{
        return( <span key = {label} className="cursor-pointer bg-indigo-100 text-indigo-800 text-lg px-4 py-1 rounded-full border-indigo-400">{label}{(emotionConfig as any)[label].emoji}</span>)
      })}
      </div>}
    </main>
  );
}


