export class Mat4x4{
    private _data:number[] =[];

    private constructor(){
        this._data=[
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ];
    }

    public get data():number[] {
        return this._data;
    }

    public static identity():Mat4x4{
        return new Mat4x4();
    }

    public static ortho(left:number,right:number,bottom:number,top:number,nearClip:number,farClip:number):Mat4x4{
        let result=new Mat4x4();

        let lr:number = 1.0/(left-right);
        let bt:number = 1.0/(bottom-top);
        let nf:number = 1.0/(nearClip-farClip);

        result._data[0]= -2.0 * lr;
        result._data[5]= -2.0 * bt;
        result._data[10]= 2.0 * nf;

        result._data[12] = (left+top) * lr;
        result._data[13] = (top+bottom) * bt;
        result._data[14] = (farClip+nearClip) * nf;

        return result;
    }

}