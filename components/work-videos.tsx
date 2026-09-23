'use client';
import {useState} from 'react';
const groups = [
 {title:'Selected work',ids:['gfHsLkB_qis','z-Kkr2_FWAw','yTRkFspQAT4','N35cUeK6YP0','nYsF6ZEejS8','PjbBqCgy_m0','swJoXp12DXQ','ZK76o9viYik']},
 {title:'Behind the scenes',ids:['KooLcSHq_HU','0palT3Bx4jw','_V2woBaVBF8']},
 {title:'Explainer reels',ids:['sBQOUGwI6BY','alkk27cChu8']},
];
function Video({id,title}:{id:string;title:string}){const [playing,setPlaying]=useState(false);return <article className="work-video"><div className="video-player">{playing?<iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>:<button type="button" onClick={()=>setPlaying(true)} aria-label={`Play ${title}`}><img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" width="480" height="360" loading="lazy"/><span className="video-play">▶<span>Play video</span></span></button>}</div><h3>{title}</h3><a className="text-link" href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></article>}
export function WorkVideos(){return <>{groups.map(group=><section className="section" key={group.title}><div className="section-heading"><h2>{group.title}</h2></div><div className="video-grid">{group.ids.map((id,i)=><Video key={id} id={id} title={`${group.title} / ${String(i+1).padStart(2,'0')}`}/>)}</div></section>)}</>}
