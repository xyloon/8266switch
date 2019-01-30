# 8266switch

## 설명

[Espruino](http://www.espruino.com) 를 기반으로 Relay를 http web service로 control하도록 함

source는 [여기](https://www.espruino.com/WiFi+Websocket+Server) 를 참고하여 개발함

## 설치 전 준비

* espruino를 esp-01 board에 설치한다. (여러가지 방법이 있음)
  * 참고로 작성자는 esptools를 사용해서 PC와 연결해서 설치하였으며(serial device = /dev/cu.wchusbserial1410) 아래와 같은 command를 사용해서 설치함
  ```!bash
    esptool.py --port /dev/cu.wchusbserial1410 write_flash --flash_freq 40m --flash_mode qio --flash_size 4m 0x0000 ~/Downloads/espruino_2v01_esp8266_combined_512.bin
    ```
* Espruino web IDE를 PC에 설치한다.


## 설치 방법

* ESP-01을 serial port에 연결한 다음 Espruino web IDE에서 연결한다.
* 첨부 코드를 Web IDE의 오른쪽 창에 copy해 넣는다.
* 코드에서 아래 부분을 수정한다. (접속할 공유기의 정보를 채워 넣는다. 이름과 password)
  ```!javascript
  var WIFI_NAME = "[replace this]";
  var WIFI_OPTIONS = {
    password: "[replace this]"
  };
  ```
* 중간에 있는 버튼을 눌러서 ESP-01쪽으로 전송한다.
* 좌측 prompt에서 다음 command를 수행한다.  ( > 는 prompt임)
  ```
  > save()
  ```
* Web IDE에서 접속을 끊고 seial 연결이 되어 있던 ESP-01의 PC와의 연결을 끊은 후 꺼내서 Relay가 장착되어 있는 board에 연결하여 사용한다.

## 사용

* 처음 relay는 off상태이며, web UI 에서도 off로 보인다.

![Relay off](/images/relay_off.jpg)

![web off screen ](/images/web_off_screen.png)

* Web UI에서 relay의 상태를 아래와 같이 바꿀 수 있다. (off to on)

![web change screen ](/images/web_change_screen.png)

* 상태가 바뀐 다음 다음과 같이 relay와 Web UI의 상태가 바뀐다. (참고로 5v전원을 연결할 곳과 AC 전원을 연결해서 switch로 쓸 부분은 아래와 같다)

![Relay on](/images/relay_on.jpg)

![web on screen ](/images/web_on_screen.png)


## Simple RESTful API

원래는 상태 변경에 대해서는 POST나 PUT을 쓰지만, 귀차니즘으로 모두 GET method로 API를 mapping하였다.


기능    | URI    | Method   | 용례
:-------|:--------:|:------ | :-------
상태조회 | http://IP/state | GET  | curl  http://IP/state
On      | http://IP/on  | GET  | curl http://IP/on
Off     | http://IP/off | GET  | curl http://IP/off



