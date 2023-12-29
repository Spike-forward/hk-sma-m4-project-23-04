INSERT INTO
    studio(name, district, address, contact_no, icon, open_time, close_time, price, description, owner_id, created_at, updated_at)
VALUES(
'Joy & Shine',
'Yuen Long',
'Cheerrick Building, Unit F, 12/F, 65 Sau Fu St, Yuen Long',
'98765432',
'studio1_icon.png',
'10:00:00',
'21:00:00',
'Non-peak:$100/hr<br>Peak:$200/hr
Non-peak: Mon-Fri 00:00-18:00
Peak: Mon-Fri 18:00-00:00 | Sat-Sun Whole Day | Public Holiday',
'🆂🆄🅼🅼🅴🆁 🆂🅰🅻🅴🌤進行中🈹
𝙰𝚎𝚛𝚒𝚊𝚕•𝙷𝚊𝚖𝚖𝚘𝚌𝚔•𝙷𝚘𝚘𝚙•𝚂𝚒𝚕𝚔•練習埸
元朗📍𝙱1出口𝟹分鐘🚶🏻‍♀️<br>𝟺.𝟹米樓底|山景|落地玻璃
𝟸 𝚂𝚙𝚒𝚗 𝚂𝚙𝚘𝚝𝚜 & 𝟻 𝙵𝚒𝚡𝚎𝚍 𝚂𝚙𝚘𝚝𝚜
自己練習🧘🏻‍♀️老師教班齊齊練👭🏻',
'1',
'2023-12-07 7:00:00',
'2023-12-07 7:00:00'
),
(
'Yoga Delight',
'Kwun Tong',
'27/F Hope Sea Ind Centre Kowloon Bay',
'54328976',
'studio2_icon.png',
'18:00:00',
'24:00:00',
'$200 / hr',
'🤍 Class。Rental 🤍 
4m ceiling。city view 🌃。private 🚽 
📍 3 mins walk from KT MTR station',
'2',
'2023-12-07 7:00:00',
'2023-12-07 7:00:00'
),
(
'YogaLuxe',
'Kwun Tong',
'12D, Tower B, Billion Center, 1 Wang Kwong Rd, Kowloon Bay',
'65439876',
'studio3_icon.png',
'15:00:00',
'18:00:00',
'Non-peak:$198/hr
Peak:$288/hr
Non-peak: Mon-Fri 00:00-18:00
Peak: Mon-Fri 18:00-00:00 | Sat-Sun Whole Day | Public Holiday',
'🩰 空中舞蹈課程｜空中及地面瑜伽課程｜場地租用 
🏞️ 4.3米高樓底｜山景落地大玻璃｜800呎課室連獨立內廁 
🏛️ 優雅圓拱門設計｜場地設有多種燈光效果',
'3',
'2023-12-07 7:00:00',
'2023-12-07 7:00:00'
),
(
'Acro Yoga',
'Central and Western',
'204, Yip Fung Building, 2-18 D’Aguilar Streer, Central',
'96155960',
'studio4_icon.png',
'10:00:00',
'23:00:00',
'🕙10am-5pm
🐣1hr > $118
🐣3hrs > $330

🕙5pm-11pm
🐣1hr > $138
🐣3hrs > $400',
'Aerial Dance & Yoga Practice Studio
|ʜᴀᴍᴍᴏᴄᴋ| |ʜᴏᴏᴘ| |ꜱɪʟᴋ| |ᴀᴇʀɪᴀʟ&ᴍᴀᴛ ʏᴏɢᴀ|
📍Central MTR 2 min walk
🔹4.2m ceilings 2 spots with Mountain View⛰',
'4',
'2023-12-07 7:00:00',
'2023-12-07 7:00:00'
),
(
'YogaBay',
'Yuen Long',
'206F, Keader Centre, 129 On Lok Road, Yuen Long, Hong Kong',
'68287318',
'studio5_icon.png',
'10:00:00',
'23:00:00',
'Non-Peak Mon-Fri Before 18:00
Single Hour: $118
2 Hours: $228

Peak Mon-Fri After 18:00, Sat, Sun, P.H
Single Hour: $148
2 Hours: $278',
'元朗租場｜瑜伽｜空中瑜伽｜空中吊床｜空中環
Private Yoga Studio 私人練習室 🧚🏻‍♀️
✦ 𝐀𝐄𝐑𝐈𝐀𝐋 & 𝐌𝐀𝐓 ✦
🪟 L-shaped window
⛰ Greenery mountain view
👉🏻 4.3m ceiling',
'5',
'2023-12-07 7:00:00',
'2023-12-07 7:00:00'
);


INSERT INTO equipment(items) VALUES ('yoga mat'),('hoop'),('wheel'),('hammock');

INSERT INTO studio_equipment (studio_id,equipment_id) 
    VALUES 
        ('1','1'),
        ('1','2'),
        ('1','3'),
        ('2','1'),
        ('3','1'),
        ('3','2'),
        ('3','3'),
        ('3','4'),
        ('4','1'),
        ('4','2'),
        ('4','3'),
        ('4','4'),
        ('5','1'),
        ('5','2'),
        ('5','3'),
        ('5','4')
        
;


INSERT INTO studio_photo (filename, cover_photo, studio_id, created_at,updated_at)
    VALUES ('studio1_image1.png',TRUE,1,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio1_image2.png',FALSE,1,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio1_image3.png',FALSE,1,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio1_image4.png',FALSE,1,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio1_image5.png',FALSE,1,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio1_image6.png',FALSE,1,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio2_image1.png',TRUE,2,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio2_image2.png',FALSE,2,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio2_image3.png',FALSE,2,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio2_image4.png',FALSE,2,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio3_image1.png',TRUE,3,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio3_image2.png',FALSE,3,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio3_image3.png',FALSE,3,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio3_image4.png',FALSE,3,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio4_image1.png',TRUE,4,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio4_image2.png',FALSE,4,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio4_image3.png',FALSE,4,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio5_image1.png',FALSE,5,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio5_image2.png',FALSE,5,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio5_image3.png',TRUE,5,'2023-12-07 7:00:00','2023-12-07 7:00:00'),
            ('studio5_image4.png',FALSE,5,'2023-12-07 7:00:00','2023-12-07 7:00:00')
            
;


-- ALTER TABLE studio ALTER COLUMN icon DROP not null;




