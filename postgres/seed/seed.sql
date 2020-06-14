-- Seed data with a Visitor user
insert into users (name, email, entries, joined) values ('Visitor', 'visitor@gmail.com', 9, '2018-01-01');
insert into login (hash, email) values ('$2a$10$WmF1E0jCZjowy5L1i51uVOcz8m/CYlI9CksAPVbVCBDpQjddA2CD2', 'visitor@gmail.com');
insert into images (url, userid) values ('https://mymodernmet.com/wp/wp-content/uploads/2019/09/100k-ai-faces-2.png', 1);
insert into images (url, userid) values ('https://i.fltcdn.net/contents/1613/original_1440006670125_ys5nwwgsyvi.jpeg', 1);
insert into images (url, userid) values ('https://img1.thelist.com/img/gallery/the-most-stunning-faces-according-to-science/intro-1555616695.jpg', 1);
insert into images (url, userid) values ('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d', 1);
insert into images (url, userid) values ('https://www.sciencenewsforstudents.org/wp-content/uploads/2019/11/860_main_beauty.png', 1);

-- Seed data with a Tester user for testing
insert into users (name, email, entries, joined) values ('Tester', 'tester@gmail.com', 2, '2018-01-01');
insert into login (hash, email) values ('$2a$10$wda6Pakq6d7KAB4.XnYLYuEwTNQ4knyB6n4Yj6QEm3d69cfcW9Ag2', 'tester@gmail.com');
insert into images (url, userid) values ('https://i.pinimg.com/236x/fe/dd/a6/fedda6e0a168a1cabad3c71b61c47c7b.jpg', 2);
insert into images (url, userid) values ('https://i.pinimg.com/736x/39/e4/40/39e4407367449c4936077a7b14cdbb8b.jpg', 2);
