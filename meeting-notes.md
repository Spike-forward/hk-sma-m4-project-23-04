# 2023-12-02 Meeting With Jason

## General
做Either time block / filter 都可以，要排次序

## Time block Feature
1. 幾時time會變unavailable？
> pending的時候已經個timeslot已經會變unavailable。所有Reject status嘅booking嘅時間都會release返。例如如果個user3日冇俾錢，個owner可以將個status又waiting for payment變為reject，咁個timeslot可以release返出黎

> for loop 入面 再set condition

2. 時間單位
> 最好set一個鐘頭為單位，唔好用30mins

3. Calendar Library by Jason
> calendar library https://fullcalendar.io/
> easier way: drop down menu

4. ERD  
> studio 個到table 寫埋opening closing時間係幾多 一小時為一個單位
> Booking timeslot，邊d人book左邊個日子，同埋邊個時間 
> 其實呢個feature都唔容易

## Cover Photo
>  覺得呢個位置可能會比較難，如果做唔到，可以randomly pick一張都可以

## Booking Confirmation Page 
> 直接轉頁，成頁reload一次 window.location 或者pop 一個alert嘅格，可以比去click success 跳返去
> 點都有個地方跳返homepage 
> alert -> https://sweetalert2.github.io/ 

## login
> either local login or social login (only local login is okay)

## 分工 / workflow
> 先寫 一個共同 express server database 
> by page 分工 而每個page都有各自 API routes 
> Either Backend or frontend 先都可以
> backend 寫API先
> frontend 寫先嘅話可以整個dummy UI

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

