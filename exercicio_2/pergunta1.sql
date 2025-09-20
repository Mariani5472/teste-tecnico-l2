SELECT 
    p.id AS professor_id,
    p.name AS professor_name,
    SUM(DATEDIFF(MINUTE, cs.start_time, cs.end_time)) / 60.0 AS total_hours
FROM PROFESSOR p
LEFT JOIN SUBJECT s ON s.professor_id = p.id
LEFT JOIN CLASS c ON c.subject_id = s.id
LEFT JOIN CLASS_SCHEDULE cs ON cs.class_id = c.id
GROUP BY p.id, p.name
ORDER BY total_hours DESC;