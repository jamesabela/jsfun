# SQL teacher answers

## 1. Select fields
```sql
SELECT ClubName, Fee FROM CLUB ORDER BY ClubName ASC;
```
Expected result: `[('Art', 8), ('Coding', 5), ('Music', 6.5)]`.

## 2. Inclusive filter
```sql
SELECT ClubName FROM CLUB WHERE Capacity >= 15 ORDER BY ClubName ASC;
```
Expected result: `[('Art',), ('Coding',)]`.

## 3. Two conditions
```sql
SELECT ClubName FROM CLUB WHERE Capacity >= 15 AND Fee < 7;
```
Expected result: `[('Coding',)]`.

## 4. Descending order
```sql
SELECT ClubName, Fee FROM CLUB ORDER BY Fee DESC;
```
Expected result: `[('Art', 8), ('Music', 6.5), ('Coding', 5)]`.

## 5. Count records
```sql
SELECT COUNT(*) FROM STUDENT WHERE ClubID = 'C01';
```
Expected result: `[(2,)]`.

## 6. Sum values
```sql
SELECT SUM(Capacity) FROM CLUB;
```
Expected result: `[(47,)]`.

## 7. Join and filter
```sql
SELECT STUDENT.StudentName, STUDENT.TutorGroup FROM STUDENT INNER JOIN CLUB ON STUDENT.ClubID = CLUB.ClubID WHERE CLUB.ClubName = 'Coding' ORDER BY STUDENT.StudentName ASC;
```
Expected result: `[('Aisha', '9A'), ('Chen', '9A')]`.

## 8. Insert a record
```sql
INSERT INTO STUDENT (StudentID, StudentName, TutorGroup, ClubID) VALUES ('S05','Eli','9B','C02');
```
Expected result: `[(2,)]`.

Check using:
```sql
SELECT COUNT(*) FROM STUDENT INNER JOIN CLUB ON STUDENT.ClubID = CLUB.ClubID WHERE CLUB.ClubName = 'Art';
```
