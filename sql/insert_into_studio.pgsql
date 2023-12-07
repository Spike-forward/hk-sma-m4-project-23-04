INSERT INTO
    studio(name, district, address, contact_no, icon, open_time, close_time, price, description, owner_id, created_at, updated_at)
VALUES(
    'Studio 1',
    'Yuen Long',
    '30/F Fairview Park',
    '98765432',
    'studio1_icon.png',
    '10:00:00',
    '21:00:00',
    'Non-peak:$100/hr<br>Peak:$200/hr<br><br>Non-peak: Mon-Fri 00:00-18:00<br>Peak: Mon-Fri 18:00-00:00 | Sat-Sun Whole Day | Public Holiday <br>',
    '🆂🆄🅼🅼🅴🆁 🆂🅰🅻🅴🌤進行中🈹 <br>𝙰𝚎𝚛𝚒𝚊𝚕•𝙷𝚊𝚖𝚖𝚘𝚌𝚔•𝙷𝚘𝚘𝚙•𝚂𝚒𝚕𝚔•練習埸 <br>元朗📍𝙱1出口𝟹分鐘🚶🏻‍♀️<br>𝟺.𝟹米樓底|山景|落地玻璃<br>𝟸 𝚂𝚙𝚒𝚗 𝚂𝚙𝚘𝚝𝚜 & 𝟻 𝙵𝚒𝚡𝚎𝚍 𝚂𝚙𝚘𝚝𝚜<br>自己練習🧘🏻‍♀️老師教班齊齊練👭🏻<br>',
    '1',
    '2023-12-07 7:00:00',
    '2023-12-07 7:00:00'
    ),
    (
    'Studio 2',
    'Kwun Tong',
    '27/F Hope Sea Ind Centre Kowloon Bay',
    '54328976',
    'studio2_icon.png',
    '18:00:00',
    '24:00:00',
    '$200 / hr',
    '🤍 Class。Rental <br>🤍 4m ceiling。city view 🌃。private 🚽 <br>📍 3 mins walk from KT MTR station',
    '2',
    '2023-12-07 7:00:00',
    '2023-12-07 7:00:00'
    ),
    (
    'Studio 3',
    'Kwun Tong',
    '12D, Tower B, Billion Center, 1 Wang Kwong Rd, Kowloon Bay',
    '65439876',
    'studio3_icon.png',
    '15:00:00',
    '18:00:00',
    'Non-peak:$198/hr <br>Peak:$288/hr <br><br>Non-peak: Mon-Fri 00:00-18:00 <br>Peak: Mon-Fri 18:00-00:00 | Sat-Sun Whole Day | Public Holiday <br>',
    '🩰 空中舞蹈課程｜空中及地面瑜伽課程｜場地租用 <br>🏞️ 4.3米高樓底｜山景落地大玻璃｜800呎課室連獨立內廁 <br>🏛️ 優雅圓拱門設計｜場地設有多種燈光效果',
    '3',
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
        ('3','4')
;


INSERT INTO studio_photo (filename, cover_photo, studio_id,created_at,updated_at)
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
            ('studio3_image4.png',FALSE,3,'2023-12-07 7:00:00','2023-12-07 7:00:00')
;






