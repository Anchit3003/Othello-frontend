export function drawDisc(ctx,row,col, color, cellSize){
    const x = col* cellSize + cellSize / 2;
    const y =  row * cellSize + cellSize/2;

    ctx.beginPath();
    ctx.arc(x,y,cellSize/2.5,0, Math.PI *2);
    ctx.fillStyle = color;
    ctx.fill();

}