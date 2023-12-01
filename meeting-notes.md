# 2023-12-02 Meeting With Jason

## Question
1. Time will only be blocked when the payment is done and the booking status is approved. Does this make sense as we do not have a timeslot release feature.


# 2023-11-30 Meeting With Jason

## Feature Comment from Jason
1. Nav bar 要有Studio Owner Login 

2. homepage 頭一頁係推介得幾個random 出，下面有一粒button可以跳去另外一個page去瀏覽全部studios
> need one more wireframe

3. 擺埋timeblock feature ，filter out booked time 
> show all the timeslot half hour for each
> only when the booking request is approved, then the timeslot will be unavailable

4. filter (if timeblock can not do, then do filter ) 
> District Filter 

## Feature priority 
Will do
1. 嘗試做time block feature 唔同嘅timeslot比人book左就唔可以再book （timeslot validation/checking) 
2. filter

Depend on time
3. Forget password 

Not this time
4. User login (maybe not, coz no time)
5. 之後嘅project可能需要一個 admin panel to approve 


## ERD 
1. Equipment 同Studio 係many to many 嘅relationship （studio id & equipement id mapping）
有先儲，冇就唔洗儲 一條record 一個equipment，JS loop over 

2. studio booking opening and closing 時間有冇，幾多點到幾多點，user只可以係呢個time range揀 
3. table name all lowercase & snake case ，全部有s就s
4. Logic how to select photo for cover page on homepage -> 拎住第一張upload嘅相片，further 有時間可以configure 揀邊張做cover photo
5. timeblock 
> calendar: could book the nearest 30 days booking
? Do we need to link with calendar to do the time block feature?

## Route Handle 
- only one HTML admin page 
- Server 可以session係咩，user id相關嘅資料，call返自己嘅資料入去 server會fetch返屬於自己嘅user 
- guard middle 
- 係session到知道佢係邊個，only fetch that user嘅user information 

## 分工
- 每個人front end 同backend都會有
- 分唔同嘅page去做 (owner dashboard)


## Booking Request Page
- Booking Request 同 Studio Information係2頁黎 
- Booking Request入面個d tab就會係 AJAX 
- 可以Default係All，然後可以再揀其他status，揀就係filter ，再render一次 ，每click一次就清空，再redner一次


# 2023-11-29
Below are questions pending to confirm.

## About ERD 
- How could we store multiple photos from one yoga studio in database? 
- How could we store the available equipment for one yoga studio in database? 
- The booking table should link with owners or the studio table? 

## About Routes
- How could we set up route so that each studio could only access its own panel only? 

## Pending Features 
- Filter to look for studio in desired location/district
- Forget password for owner login 
- Time block
- User Login for Booking History 

