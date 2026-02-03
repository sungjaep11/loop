# 카메라 / 사진 단계(검은 화면) 로직 분석

## 화면이 나오는 흐름 (Step 2 Identity Verification)

1. **Step 1 (Permission)**  
   - 사용자가 "Allow" 클릭 → `handlePermission(true)`  
   - `requestWebcam()` 호출 → **한 번만** `getUserMedia()` 실행  
   - 얻은 스트림을 `playerStore.webcamStream`에 저장  
   - `setStep(2)` 로 Photo 단계로 전환  

2. **Step 2 (Photo)**  
   - `step === 2` 인 `motion.div` 가 렌더되며 그 안에 `<video ref={videoRef} />` 가 마운트됨  
   - `useEffect(step === 2)` 실행  
   - **수정 전**: 여기서 **다시** `getUserMedia()` 호출 → 두 번째 스트림을 받아서 `video.srcObject`에 붙임  
   - **수정 후**: `webcamStream`(Step 1에서 얻은 스트림)이 있으면 **그 스트림만** `video.srcObject`에 붙임  

3. **비디오 재생**  
   - `video.srcObject = stream`  
   - `video.play()`  
   - `playing` 이벤트 또는 800ms 후 `setPhotoStatus('ready')` → "Take Photo" 버튼 표시  

4. **캡처**  
   - "Take Photo" 클릭 → `capturePhoto()`  
   - `video.readyState >= 2` 일 때만 `ctx.drawImage(video, ...)` 로 캡처 (검은 프레임 방지)  
   - 캡처 후 스트림 stop, `setWebcamStream(null)`  

---

## 검은 화면이 나오던 이유 (초록불은 들어오는데 화면만 검은 경우)

- **이중 getUserMedia**  
  - Step 1 "Allow" 에서 `requestWebcam()` → 스트림 1 획득, `playerStore.webcamStream`에 저장  
  - Step 2 진입 시 `useEffect` 에서 **또** `getUserMedia()` → 스트림 2 획득  
  - 브라우저/OS에 따라 카메라를 두 번 열면:  
    - 두 번째 스트림이 아직 프레임을 안 주어서 검게 나오거나  
    - 첫 번째만 활성이고 두 번째는 비어 있거나  
    - 한 스트림만 실제로 사용 가능한데, 화면에 붙은 건 비어 있는 쪽이라 검게 보일 수 있음  
- **초록불(카메라 활성 표시)은** 권한 허용 + 스트림이 하나라도 열려 있어서 들어오고, **실제로 그려지는 건** Step 2의 `<video>`에 붙은 (두 번째로 연) 스트림이라서 검은 화면이 됨  

---

## 수정 내용 요약

| 항목 | 수정 전 | 수정 후 |
|------|--------|--------|
| Step 2 스트림 | 매번 `getUserMedia()` 로 새 스트림 | Step 1에서 쓴 `webcamStream` 재사용 |
| 스트림 소유 | Step 2에서 연 스트림을 cleanup에서 stop | store에서 가져온 스트림은 cleanup에서 stop 안 함, 캡처/스킵 시에만 stop |
| Store 동기화 | 없음 | 캡처/스킵 시 `setWebcamStream(null)` 호출 |

이제 Step 2에서는 **한 번 연 스트림만** 비디오에 붙이므로, 초록불이 들어온 그 스트림이 그대로 화면에 나와야 하고 검은 화면이 사라져야 합니다.
