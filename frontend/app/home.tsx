"use client";

import React, { useState, useEffect } from "react";

export default function Home() {
  const [time, setTime] = useState<string>("");
  const [name, setName] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState<string>("");
  const [loopAppOpen, setLoopAppOpen] = useState(false);

  // 시계 기능: 1초마다 현재 시간 업데이트
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setTime(timeString);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNameSubmit = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      setName(trimmed);
    }
  };

  const showNameDialog = name === null;

  return (
    <div className="h-screen bg-[#1a1a1a] flex items-center justify-center p-2 font-sans select-none overflow-hidden">
      {/* CRT 모니터 본체 - 16:9 to match loop gameplay so entire loop screen is shown */}
      <div
        className="relative bg-[#dcdcdc] pt-8 px-4 pb-4 rounded-xl shadow-[0_0_0_2px_#a0a0a0,0_20px_40px_rgba(0,0,0,0.5)] w-full max-w-[90vw] aspect-video flex flex-col min-h-0 border-b-6 border-r-6 border-[#909090]"
        style={{ maxHeight: "calc(100vh - 1rem)", width: "min(90vw, (100vh - 1rem) * 16 / 9)" }}
      >
        
        {/* 모니터 상단 곡선 디테일 */}
        <div className="absolute top-2 left-4 right-4 h-2 bg-[#e8e8e8] rounded-full opacity-50"></div>

        {/* 카메라 구멍 (상단 중앙) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-[#404040]"></div>

        {/* 스크린 베젤 (화면 안쪽 검은 테두리) - tighter so loop gets more space */}
        <div className="flex-1 min-h-0 bg-[#111] pt-3 px-1.5 pb-1.5 rounded-lg shadow-[inset_0_0_20px_rgba(0,0,0,1)] border-[8px] border-[#a0a0a0] border-t-[#808080] border-l-[#808080] border-b-[#e0e0e0] border-r-[#e0e0e0] relative overflow-hidden">
          
          {/* 실제 화면 영역 (CRT 느낌의 곡률과 스캔라인 효과는 CSS로 흉내 가능하지만 가독성을 위해 생략) */}
          <div className="w-full h-full min-h-0 bg-[#008080] flex flex-col justify-between relative shadow-[inset_0_0_40px_rgba(0,0,0,0.3)]">
            
            {/* 바탕화면 영역 */}
            <div className="flex-1 min-h-0 relative">
              {/* loop.exe desktop icon - top left */}
              <button
                type="button"
                className="absolute top-4 left-4 flex flex-col items-center gap-1.5 w-[72px] p-1 rounded-none outline-none select-none cursor-pointer border-0 border-transparent active:bg-[#000080] group"
                onDoubleClick={() => setLoopAppOpen(true)}
              >
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 bg-white rounded-sm shadow-[inset_1px_1px_0_#fff,1px_1px_0_#808080] border border-[#c0c0c0]">
                  {/* Windows .exe style icon: window with blue title bar */}
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="5" width="20" height="14" fill="#c0c0c0" stroke="#808080" strokeWidth="1" />
                    <rect x="2" y="5" width="20" height="4" fill="#000080" />
                    <rect x="4" y="7" width="4" height="1" fill="#fff" />
                    <rect x="11" y="11" width="8" height="1" fill="#000" />
                    <rect x="11" y="14" width="6" height="1" fill="#000" />
                  </svg>
                </div>
                <span
                  className="text-[11px] font-normal text-center leading-tight px-0.5 break-words max-w-[72px] text-black group-active:text-white group-active:[text-shadow:none]"
                  style={{ textShadow: "1px 0 0 #fff, 0 1px 0 #fff, -1px 0 0 #fff, 0 -1px 0 #fff" }}
                >
                  loop.exe
                </span>
              </button>

              {/* loop.exe window - fills desktop when open */}
              {loopAppOpen && (
                <div className="absolute inset-0 z-10 flex flex-col bg-[#c0c0c0] shadow-[2px_2px_0_#fff,inset_2px_2px_0_#808080] border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080]">
                  {/* Title bar */}
                  <div
                    className="flex items-center justify-between px-2 py-0.5 h-6 flex-shrink-0"
                    style={{ background: "linear-gradient(90deg, #000080 0%, #1084d0 100%)" }}
                  >
                    <span className="text-white text-xs font-bold" style={{ textShadow: "1px 1px 0 #000" }}>
                      loop.exe
                    </span>
                    <div className="flex gap-0.5">
                      <div className="w-3.5 h-3.5 flex items-center justify-center text-black text-[10px] font-bold bg-[#c0c0c0] border border-t-[#fff] border-l-[#fff] border-b-[#808080] border-r-[#808080]">−</div>
                      <div className="w-3.5 h-3.5 flex items-center justify-center text-black text-[10px] font-bold bg-[#c0c0c0] border border-t-[#fff] border-l-[#fff] border-b-[#808080] border-r-[#808080]">□</div>
                      <button
                        type="button"
                        onClick={() => setLoopAppOpen(false)}
                        className="w-3.5 h-3.5 flex items-center justify-center text-black text-[10px] font-bold bg-[#c0c0c0] border border-t-[#fff] border-l-[#fff] border-b-[#808080] border-r-[#808080] hover:bg-[#ff0000] hover:text-white outline-none"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  {/* Window content - iframe to loop app */}
                  <div className="flex-1 min-h-0 relative">
                    <iframe
                      title="loop"
                      src="/loop/index.html"
                      className="absolute inset-0 w-full h-full border-0 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* "What is your name?" dialog - Windows 95 style */}
              {showNameDialog && (
                <div className="absolute inset-0 flex items-center justify-center z-20 p-8">
                  <div
                    className="w-full max-w-sm bg-[#c0c0c0] flex flex-col shadow-[2px_2px_0_#fff,inset_2px_2px_0_#808080] border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080]"
                    style={{ boxShadow: "2px 2px 0 #0a0a0a" }}
                  >
                    {/* Title bar - Windows 95 blue */}
                    <div
                      className="flex items-center justify-between px-2 py-1 h-7"
                      style={{
                        background: "linear-gradient(90deg, #000080 0%, #1084d0 100%)",
                      }}
                    >
                      <span className="text-white text-sm font-bold" style={{ textShadow: "1px 1px 0 #000" }}>
                        What is your name?
                      </span>
                      <div className="flex gap-0.5">
                        <div className="w-4 h-4 flex items-center justify-center text-white text-xs font-bold bg-[#c0c0c0] border border-t-[#fff] border-l-[#fff] border-b-[#808080] border-r-[#808080] text-black">−</div>
                        <div className="w-4 h-4 flex items-center justify-center text-black text-xs font-bold bg-[#c0c0c0] border border-t-[#fff] border-l-[#fff] border-b-[#808080] border-r-[#808080]">□</div>
                        <div className="w-4 h-4 flex items-center justify-center text-black text-xs font-bold bg-[#c0c0c0] border border-t-[#fff] border-l-[#fff] border-b-[#808080] border-r-[#808080]">×</div>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-4 flex flex-col gap-4">
                      <input
                        type="text"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                        placeholder="Name"
                        className="w-full px-2 py-1.5 bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#dfdfdf] border-r-[#dfdfdf] outline-none text-sm text-black placeholder:text-[#808080]"
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleNameSubmit}
                          className="px-4 py-1 min-w-[75px] h-7 bg-[#c0c0c0] border-2 border-t-[#fff] border-l-[#fff] border-b-[#808080] border-r-[#808080] text-sm font-bold text-black active:border-t-[#808080] active:border-l-[#808080] active:border-b-[#fff] active:border-r-[#fff] outline-none"
                        >
                          OK
                        </button>
                        <button
                          type="button"
                          onClick={() => setName("")}
                          className="px-4 py-1 min-w-[75px] h-7 bg-[#c0c0c0] border-2 border-t-[#fff] border-l-[#fff] border-b-[#808080] border-r-[#808080] text-sm font-bold text-black active:border-t-[#808080] active:border-l-[#808080] active:border-b-[#fff] active:border-r-[#fff] outline-none"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 작업 표시줄 (Taskbar) - hidden when loop game is running */}
            {!loopAppOpen && (
            <div className="h-[34px] flex-shrink-0 bg-[#c0c0c0] border-t-2 border-white flex items-center justify-between px-1 relative z-10 shadow-md">
              
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
            )}
          </div>
          
          {/* 화면 반사광 (Glossy Effect) */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-transparent to-white opacity-[0.03] pointer-events-none rounded-lg"></div>
        </div>

        {/* 모니터 하단 전원 버튼 */}
        <div className="h-8 flex flex-shrink-0 justify-end items-center px-4 pt-2">
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
