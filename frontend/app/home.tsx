"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
  const [time, setTime] = useState<string>("");

  // 시계 기능: 1초마다 현재 시간 업데이트
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // 오후 5:01 같은 형식 (Windows 95 스타일)
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setTime(timeString);
    };

    updateTime(); // 초기 실행
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4 font-sans select-none overflow-hidden">
      {/* CRT 모니터 본체 */}
      <div className="relative bg-[#dcdcdc] p-8 rounded-xl shadow-[0_0_0_2px_#a0a0a0,0_20px_40px_rgba(0,0,0,0.5)] w-full max-w-5xl aspect-[4/3] flex flex-col border-b-8 border-r-8 border-[#909090]">
        
        {/* 모니터 상단 곡선 디테일 */}
        <div className="absolute top-2 left-4 right-4 h-2 bg-[#e8e8e8] rounded-full opacity-50"></div>

        {/* 스크린 베젤 (화면 안쪽 검은 테두리) */}
        <div className="flex-1 bg-[#111] p-4 rounded-lg shadow-[inset_0_0_20px_rgba(0,0,0,1)] border-[16px] border-[#a0a0a0] border-t-[#808080] border-l-[#808080] border-b-[#e0e0e0] border-r-[#e0e0e0] relative overflow-hidden">
          
          {/* 실제 화면 영역 (CRT 느낌의 곡률과 스캔라인 효과는 CSS로 흉내 가능하지만 가독성을 위해 생략) */}
          <div className="w-full h-full bg-[#008080] flex flex-col justify-between relative shadow-[inset_0_0_40px_rgba(0,0,0,0.3)]">
            
            {/* 바탕화면 영역 (아이콘 없음) */}
            <div className="flex-1 relative">
              {/* 여기에 추후 아이콘 컴포넌트 추가 가능 */}
            </div>

            {/* 작업 표시줄 (Taskbar) */}
            <div className="h-[34px] bg-[#c0c0c0] border-t-2 border-white flex items-center justify-between px-1 relative z-10 shadow-md">
              
              {/* 시작 버튼 */}
              <button className="flex items-center gap-1.5 px-2 py-0.5 h-[26px] bg-[#c0c0c0] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white active:bg-[#b0b0b0] shadow-sm outline-none">
                {/* 윈도우 로고 (SVG) */}
                <div className="w-4 h-4 relative flex flex-wrap">
                    <div className="w-1.5 h-1.5 bg-[#e05b4c] absolute top-0 left-0"></div>
                    <div className="w-1.5 h-1.5 bg-[#6bb354] absolute top-0 right-0"></div>
                    <div className="w-1.5 h-1.5 bg-[#5b89d6] absolute bottom-0 left-0"></div>
                    <div className="w-1.5 h-1.5 bg-[#eecd33] absolute bottom-0 right-0"></div>
                </div>
                <span className="font-bold text-sm text-black tracking-tight" style={{textShadow: "0.5px 0.5px 0 #808080"}}>Start</span>
              </button>

              {/* 우측 하단 트레이 영역 */}
              <div className="flex items-center h-[26px] pl-2 pr-3 border-t-2 border-l-2 border-[#808080] border-b-2 border-r-2 border-white bg-[#c0c0c0]">
                {/* 작은 스피커 아이콘 (CSS로 그림) */}
                <div className="mr-3 opacity-80">
                   <div className="w-3 h-3 bg-transparent border-l-4 border-l-black border-y-4 border-y-transparent"></div>
                </div>
                {/* 실제 시간 표시 */}
                <span className="text-xs font-medium text-black">{time}</span>
              </div>
            </div>
          </div>
          
          {/* 화면 반사광 (Glossy Effect) */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-transparent to-white opacity-[0.03] pointer-events-none rounded-lg"></div>
        </div>

        {/* 모니터 하단 로고 및 전원 버튼 */}
        <div className="h-16 flex justify-between items-center px-8 pt-4">
            {/* 로고 */}
            <div className="text-[#606060] font-sans font-bold text-lg tracking-widest opacity-80" style={{ fontFamily: "Arial, sans-serif" }}>
                NETFLIX
            </div>

            {/* 컨트롤 패널 */}
            <div className="flex items-center gap-6">
                {/* 메뉴 버튼들 */}
                <div className="flex gap-3">
                    <div className="w-6 h-2 rounded-full bg-[#b0b0b0] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.3)]"></div>
                    <div className="w-6 h-2 rounded-full bg-[#b0b0b0] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.3)]"></div>
                    <div className="w-6 h-2 rounded-full bg-[#b0b0b0] shadow-[inset_1px_1px_1px_rgba(0,0,0,0.3)]"></div>
                </div>
                
                {/* 전원 버튼과 LED */}
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80] animate-pulse"></div> {/* LED */}
                    <button className="w-8 h-8 bg-[#d0d0d0] border-2 border-[#f0f0f0] border-b-[#808080] border-r-[#808080] active:border-[#808080] active:border-b-[#f0f0f0] active:border-r-[#f0f0f0] rounded-sm shadow-sm"></button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
