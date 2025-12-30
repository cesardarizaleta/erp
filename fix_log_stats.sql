-- Corrección para la función get_log_statistics
-- El error "Returned type character varying(50) does not match expected type text" ocurre porque
-- la tabla logs tiene table_name como VARCHAR(50) y la función espera TEXT.

CREATE OR REPLACE FUNCTION get_log_statistics(
    p_days INTEGER DEFAULT 30
) RETURNS TABLE(
    table_name TEXT,
    operation TEXT,
    count BIGINT,
    last_operation TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        sl.table_name::TEXT,  -- Cast explícito a TEXT
        sl.operation::TEXT,   -- Cast explícito a TEXT
        COUNT(*) as count,
        MAX(sl.timestamp) as last_operation
    FROM logs sl
    WHERE sl.timestamp >= NOW() - INTERVAL '1 day' * p_days
    GROUP BY sl.table_name, sl.operation
    ORDER BY sl.table_name, sl.operation;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mensaje de confirmación
SELECT '✅ Función get_log_statistics corregida correctamente.' as status;
