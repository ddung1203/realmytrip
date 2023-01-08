# 자유여행 가이드 투어 서비스

'가이드 투어 서비스 제작' 이라는 프로젝트 타이틀과 사용자 및 회원가입, 투어 상품 정보 등록/관리, 투어상품 조회, 투어상품 예약으로 크게 나누어 구상을 진행하였습니다.

모바일 환경에서도 서비스를 확인 가능하도록 Responsive Design을 하였습니다.

<br>

### 메인 페이지
![image](https://user-images.githubusercontent.com/54924917/183276787-7fe0edc6-d695-4765-9819-f8b47cf6729f.png)
<br>
<br>
![image](https://user-images.githubusercontent.com/54924917/183276798-b696b8ec-9467-4107-b033-24f2ac09ec62.png)

- 관련 유사 사이트인 ‘마이리얼트립’ 에 대한 조사결과 여행지나 상품을 바로 검색할 수 있도록 검색창이 있었으며, 사용자 편리를 위해 검색창을 생성했습니다.
- 검색창에는 제목과 투어내용 그리고 가이드가 지정한 태그들을 검색할 수 있도록 했습니다. 이 기능은 로그인을 하지 않은 사용자도 접근할 수 있지만, 예약이나 부가서비스를 사용하기 위해선 회원가입을 필수로 하도록 구성하였습니다.
- '마이리얼트립' 메인 홈페이지에는 슬라이드 기능으로 광고 및 여행지 추천기능으로 사용자에게 구매를 장려하였고, 제가 구상한 홈페이지에도 슬라이드쇼와 가이드가 추천하는 여행지와 바로가기를 통해 쉽게 접근할 수 있도록 설계를 했습니다.

<br>

### 로그인 기능
![image](https://user-images.githubusercontent.com/54924917/183276809-394b3f4e-a3c1-4b69-9c3f-7f118562a1f4.png)
![image](https://user-images.githubusercontent.com/54924917/183276810-e80117bc-e386-44c0-b472-f7bf1f6fd459.png)
- 로그인 기능입니다. '마이리얼트립' 에서 페이스북과 네이버로 로그인하기 기능으로 사용자에게 편리를 주고 있습니다. 사용자 편리를 위해 페이스북으로 로그인할 수 있는 기능을 추가하였습니다.
- 만약 회원이 탈퇴한다면, 회원의 개인 정보는 즉각 삭제되며 로그인을 할 수 없도록 하였습니다.
- 비밀번호의 저장방식은 암호화를 통해 저장되어 관리자도 접근할 수 없도록 설계를 하였습니다.
- 로그인이 성공적으로 된다면 메인 페이지로 전환이 되면서 Welcome! 이되지만 만약 로그인에 실패한다면
  - Invalid email or password
  - 이메일 주소에 ‘@’를 포함해주세요
	경고가 나오도록 하였습니다.
  
<br>

### 회원가입 기능
![image](https://user-images.githubusercontent.com/54924917/183276831-19309b21-42c2-4d81-aea7-3b4f5a24e45b.png)
- 회원가입 기능입니다. 이메일 값으로 입력을 받으며,
  - 이메일이 아닌 경우와 이미 등록된 이메일의 경우
  - 비밀번호가 유효하지 않을 경우
  - 중요 값들에 대해 입력을 안 한 경우
  사용자에게 경고 알림 창을 통해 잘못된 값이란 것을 표시해줍니다.
- 사용자와 가이드 중 선택을 통해 가입할 수 있지만, 관리자는 고유의 권한으로 관리자가 직접 권한을 지정할 수 있으며, 이를 통해 누구든 관리자가 될 수 없도록 하였습니다. 또한 여러 명의 관리자 계정을 생성할 수 있도록 하였습니다.

<br>

### 사용자 관리페이지
![image](https://user-images.githubusercontent.com/54924917/183276854-5916a6f3-b013-4097-8d70-44a8a5f4fb9e.png)
![image](https://user-images.githubusercontent.com/54924917/183276868-481fc954-d178-4afa-b68b-1f062bfbc47a.png)
![image](https://user-images.githubusercontent.com/54924917/183276870-a93ad47a-411f-41f8-a6e0-50dc0b9b9902.png)


- 위 기능을 통해 사용자 편집 및 삭제가 가능하며 편집 기능을 통해 사용자에게 추가적인 권한 부여(관리자)를 할 수 있습니다.

- 만약 페이스북 프로필 내에 등록된 사진이 있다면 등록된 사진을 통해 '사용자 관리' 페이지에서 확인할 수 있습니다.

- 페이스북 내에는 이메일이 아닌 형태가 존재할 수 있습니다. 이런 경우 사용자 고유의 ID를 통해 구분을 하였으며 이메일 형식을 지키기 위해 @no-email.com 으로 대체 했습니다. 페이스북 로그인의 기본값은 사용자이며 '사용자 관리' 페이지 내에서 추가적인 권한 부여가 가능합니다.

- 프로필 수정 페이지는 관리자와 사용자의 화면이 다르게 하였고, 일반 사용자의 경우 관리자 지정 버튼을 안보이도록 하였습니다. 관리자는 관리자권한으로 유저리스트를 볼 수 있으며 이 정보를 수정할 수 있습니다.


<br>

### 투어 상세페이지
![image](https://user-images.githubusercontent.com/54924917/183276874-8f1b9cf8-879a-4bfb-bb5b-014c412b5a08.png)
![image](https://user-images.githubusercontent.com/54924917/183276878-fd3f016a-7c96-4ddb-80a4-91fd6959b183.png)
![image](https://user-images.githubusercontent.com/54924917/183276882-2c1a96a7-cfd9-453a-81c4-145fddb0cb9e.png)
![image](https://user-images.githubusercontent.com/54924917/183276883-b2915568-f548-4b08-9b20-e49b9727dbbf.png)
- 위 페이지에는 검색창이 있으며, 이 검색창을 통해 제목, 투어내용 그리고 가이드가 지정한 태그들을 검색할 수 있도록 하였습니다. 정렬은 최신순으로 되어있고, 한 페이지에 10개씩 표시하도록 하였습니다. 페이지가 넘어가게 된다면 다음으로 넘겨 확인할 수 있습니다.

- 이 페이지를 통해 대략적으로 어떤 투어가 있는지 살펴볼 수 있습니다. 가격, 좋아요, 후기와 읽은 수를 통해 인기있는 상품을 사용자가 한눈에 볼 수 있습니다. 투어의 제목을 클릭하면 상세한 투어를 볼 수 있습니다.

- 투어 가이드는 투어에 대한 편집과 삭제기능을 갖고 있으며, 투어를 게시할 때 사진을 업로드가 가능합니다. 또한 투어 내용에 대해 에디터를 이용하여 입력 받도록 하였고 에디터 내의 리스트 기능으로 여행 코스를 상세히 등록할 수 있도록 하였습니다.

- 각 투어에는 후기를 작성할 수 있으며 후기에는 등급으로 점수를 매길 수 있습니다. 언제 누가 작성했는지를 알 수 있고 후기에 대한 좋아요를 줄 수 있다.


<br>

### 예약
![image](https://user-images.githubusercontent.com/54924917/183276891-a65b61b9-8ff1-4744-99e3-833cca3d9aa1.png)
![image](https://user-images.githubusercontent.com/54924917/183276892-bde931f3-b050-49e1-a722-d13e862f07df.png)
![image](https://user-images.githubusercontent.com/54924917/183276893-61d6a8cb-a4de-44a2-b9ca-22a2a20b5714.png)
- 예약기능은 투어 상세페이지 내에서 할 수 있으며, 날짜, 인원, 금액을 선택할 수 있습니다. 금액은 인원에 따라 차등부과 되며, 사용자는 고유식별 번호를 통해 예약내역을 볼 수 있습니다.

- 고객은 예약을 취소할 수 있고, 가이드 및 관리자는 예약을 수정과 취소를 할 수 있습니다.

- 가이드 및 관리자는 모든 예약내역을 볼 수 있으며, 투어 고유 번호 검색을 통해 상품에 대한 특정 아이디별 예약내역을 볼 수 있습니다.

- 일반 사용자는 예약확인 페이지에 들어간다면 개인의 고유식별 아이디로 자신만의 예약만 확인할 수 있습니다. 

<br>

### Responsive Web Design
![image](https://user-images.githubusercontent.com/54924917/183276910-e9ef7a76-ad9d-47c0-9de5-ee982209fd31.png)
![image](https://user-images.githubusercontent.com/54924917/183276908-9c31848a-1b72-4ff1-af0b-38d03401f3d5.png)

- 'myrealtrip'의 모든 페이지는 반응형 웹 디자인을 통해 사용자에게 편리성을 주었습니다

- 제가 구현한 모든 페이지는 디바이스의 화면 크기에 따라 알맞은 형태로 웹 페이지를 보여줄 수 있도록 디자인을 진행하였습니다.

- 이로 인해 다양한 디바이스를 가진 사용자들이 편리하게 웹 페이지를 볼 수 있도록 하였습니다.

<br>

### 결론
- Nodejs, expressjs, mongodb를 사용했으며 최신 브라우저에서 사용이 가능한 것을 확인했다. 결과물은 Heroku를 통해 deploy했다.

- File Upload기능은 local에서 정상 작동하지만, AWS S3 내 저장 로직을 구현하지 못해 이미지 파일이 불안정한 것을 확인할 수 있다.

- 하지만 사진을 게시 하는것과 페이스북 로그인, 좋아요 기능과 후기등록, 예약 등 기본적인 기능들을 구현하는데 성공했다.

- 프로젝트의 모든 소스코드는 Github에 있으며 구현한 기능별로 폴더를 만들었다. 최종 소스코드는 Github내의 heroku폴더에 있습니다.