
export default class InputHandler{

    private bodyElement:HTMLElement;

    constructor(target:HTMLElement){
        this.bodyElement=target;
        this.bodyElement.addEventListener("keydown", this.onKeyDown,false);
    }

    onKeyDown(event:KeyboardEvent):void{
        if(event.key==="ArrowUp"){
            console.log("UP!");
        }

    }

}