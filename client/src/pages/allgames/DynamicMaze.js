// src/pages/allgames/DynamicMaze.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const BASE_MAZES=[["#####","#   #","# # #","#   #","#####"],["#####","# # #","#   #","# # #","#####"],["#####","#   #","### #","#   #","#####"]];
export default function DynamicMaze() {
  const startRef=useRef(Date.now());
  const size=5;
  const [maze,setMaze]=useState([]);
  const [player,setPlayer]=useState({x:1,y:1});

  useEffect(() => {
    startRef.current=Date.now();
    const id=setInterval(loadRandomMaze,3000);
    loadRandomMaze();
    return()=>clearInterval(id);
  }, []);

  function loadRandomMaze() {
    const layout=BASE_MAZES[Math.floor(Math.random()*BASE_MAZES.length)];
    setMaze(layout.map(row=>row.split('')));
    setPlayer({x:1,y:1});
  }

  function handleKey(e) {
    e.preventDefault();
    const {x,y}=player;
    let nx=x,ny=y;
    if(e.key==='ArrowUp')ny--;
    if(e.key==='ArrowDown')ny++;
    if(e.key==='ArrowLeft')nx--;
    if(e.key==='ArrowRight')nx++;
    if(maze[ny]&&maze[ny][nx]===' '){setPlayer({x:nx,y:ny});}
  }

  useEffect(() => { window.addEventListener('keydown',handleKey); return()=>window.removeEventListener('keydown',handleKey); }, [player,maze]);

  useEffect(() => {
    if(player.x===size-2&&player.y===size-2){
      const timeSpent=Math.floor((Date.now()-startRef.current)/1000);
      const token=sessionStorage.getItem('token');
      axios.post('/api/results',{gameId:18,score:1,timeSpent},{headers:{Authorization:`Bearer ${token}`}}).catch(console.error);
    }
  }, [player]);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Dynamic Maze</h1>
      <div className="grid grid-cols-5 gap-0">{maze.flatMap((row,y)=>row.map((cell,x)=>{
        const isPlayer=x===player.x&&y===player.y;
        const bg=cell==='#'?'bg-black':isPlayer?'bg-blue-500':'bg-white';
        return <div key={`${x}-${y}`} className={`${bg} w-8 h-8 border border-gray-300`} />;
      }))}</div>
      <p className="mt-4 text-gray-700">Use arrow keys to move. Maze reshuffles every 3 seconds.</p>
    </div>
  );
}