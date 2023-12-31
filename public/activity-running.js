var clearTime;
var seconds = 0;
var minutes = 0;
var hours = 0;
var secs, mins, gethours;

function startWatch() {
    if (seconds === 60) {
        seconds = 0;
        minutes = minutes + 1;
    }

    mins = minutes < 10 ? "0" + minutes + ": " : minutes + ": ";
    if (minutes === 60) {
        minutes = 0;
        hours = hours + 1;
    }

    gethours = hours < 10 ? "0" + hours + ": " : hours + ": ";
    secs = seconds < 10 ? "0" + seconds : seconds;

    const x = document.getElementById("timer");
    x.innerHTML = gethours + mins + secs;

    seconds++;

    clearTime = setTimeout(startWatch, 1000);
}

function startTime() {
    /* 초, 분, 시간이 0인지 확인하고 카운트업을 시작하세요. */
    if (seconds === 0 && minutes === 0 && hours === 0) {
        /* 카운트업이 실행 중일 때 풀타임 숨기기 */
        const fulltime = document.getElementById("fulltime");
        if (fulltime) {
            fulltime.style.display = "none";
        }
        const showStart = document.getElementById("start");
        showStart.style.display = "none";

        /* startTime()이 트리거될 때마다 Count-Up을 실행하기 위해 startWatch() 함수를 호출합니다. */
        startWatch();
    }
}

/*시간을 멈추는 함수를 만들어라 */
function stopTime() {
    /* 초, 분, 시간이 0이 아닌지 확인하십시오. */
    if (seconds !== 0 || minutes !== 0 || hours !== 0) {
        const continueButton = document.getElementById("continue");
        continueButton.setAttribute("hidden", "false");
        const runtimeInput = document.getElementById("runtime");
        const fulltime = document.getElementById("fulltime");
        runtimeInput.value = gethours.trim() + mins.trim() + secs.trim();
        if (fulltime) {
            fulltime.style.display = "block";
            const time = gethours.trim() + mins.trim() + secs.trim();
            fulltime.textContent = "기록된 시간은 " + time + " 입니다.";
            runtimeInput.value = time;
            document.getElementById("activityForm").style.display = "block";
        }
        // 카운트업 재설정
        seconds = 0;
        minutes = 0;
        hours = 0;
        secs = "0" + seconds;
        mins = "0" + minutes + ": ";
        gethours = "0" + hours + ": ";

        /* 정지된 후 카운트업 타이머를 표시합니다. */
        const x = document.getElementById("timer");
        const stopTime = gethours + mins + secs;
        x.innerHTML = stopTime;

        /* 모든 카운트업 제어 버튼 표시 */
        const showStart = document.getElementById("start");
        showStart.style.display = "inline-block";
        const showStop = document.getElementById("stop");
        showStop.style.display = "inline-block";
        const showPause = document.getElementById("pause");
        showPause.style.display = "inline-block";

        /* setTimeout() 반환 값 'clearTime'을 ID로 사용하여 카운트 업을 지웁니다. */
        clearTimeout(clearTime);
    }
}

function pauseTime() {
    if (seconds !== 0 || minutes !== 0 || hours !== 0) {
        /* 일시 정지 버튼을 클릭한 후 카운트업 타이머를 표시합니다. */
        const x = document.getElementById("timer");
        const stopTime = gethours + mins + secs;
        x.innerHTML = stopTime;

        /* setTimeout() 반환 값 'clearTime'을 ID로 사용하여 카운트 업을 지웁니다. */
        clearTimeout(clearTime);
    }
}

function continueTime() {
    if (seconds !== 0 || minutes !== 0 || hours !== 0) {
        /* 일시중지된 후 카운트업 타이머를 표시합니다. */
        const x = document.getElementById("timer");
        const continueTime = gethours + mins + secs;
        x.innerHTML = continueTime;

        /* setTimeout() 반환 값 'clearTime'을 ID로 사용하여 Count-Up을 지웁니다. 카운트업을 계속 유지하려면 setTimeout()을 호출하세요! */
        clearTime = setTimeout(startWatch, 1000);
    }
}

window.addEventListener("load", function() {
    document.getElementById("start").addEventListener("click", startTime);
    document.getElementById("stop").addEventListener("click", stopTime);
    document.getElementById("pause").addEventListener("click", pauseTime);
    document.getElementById("continue").addEventListener("click", continueTime);
});