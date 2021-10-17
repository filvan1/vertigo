import Renderer from "./renderer/Renderer";



export default class Input{
    bodyElement: HTMLElement;
    renderer: Renderer;

    constructor(target:HTMLElement, rend:Renderer){
        this.bodyElement=target;
        this.bodyElement.addEventListener("keydown", this.onKeyDown,false);
        this.renderer=rend;
    }

    onKeyDown(event:KeyboardEvent):void{
        if(event.key==="ArrowUp"){
            console.log("UP!");
        }

    }

}