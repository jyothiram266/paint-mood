import { HfInference, TextClassificationOutput } from "@huggingface/inference" ;

let hf:HfInference


export async function POST(req : Request , res : Response){
    const {input} = await req.json();
    const inferenceResponse : TextClassificationOutput = await RunInference(input);
    console.log(inferenceResponse);
    const fliteredResponse = fliterResponse([...inferenceResponse]);


    return new Response (JSON.stringify({
        inferenceResponse,
        fliteredResponse
    }), {status : 200});
}

async function RunInference (input : string)  {
    if(!hf){
        hf = new HfInference(process.env.HF_TOKEN);
    }
    const modelName = "SamLowe/roberta-base-go_emotions"
    const inference = await hf.textClassification({
        model : modelName,
        inputs : input
    })
    return inference;
}

function fliterResponse( emotions : TextClassificationOutput){
    const filtered = [];
    const emotion0 =  emotions.shift();
    filtered.push(emotion0);
    let score = emotion0?.score; 
    while(emotions.length>0){
        const emotion1 = emotions.shift();
        if(emotion1?.score! > score!*0.5 ){
            filtered.push(emotion1);
            score = emotion1?.score;
        }else{
            break
        }

    }
    return filtered;

}