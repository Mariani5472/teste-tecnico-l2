
WITH Horarios AS (
    SELECT CAST('08:00' AS TIME) AS start_time, CAST('18:00' AS TIME) AS end_time
)
SELECT 
    r.id AS room_id,
    r.name AS room_name,
    h.start_time,
    h.end_time,
    CASE WHEN cs.id IS NULL THEN 'Livre' ELSE 'Ocupado' END AS status
FROM ROOM r
CROSS JOIN Horarios h
LEFT JOIN CLASS_SCHEDULE cs 
    ON r.id = cs.room_id
   AND h.start_time >= cs.start_time
   AND h.end_time <= cs.end_time
ORDER BY r.name, h.start_time;

