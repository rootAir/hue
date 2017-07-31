set hive.execution.engine=mr;
set hive.exec.parallel=true;
set hive.exec.reducers.max=90;

--PUBLICO 2 -> MZ_SIT_GEST_PUBLIC_2.hql
--MZ PUBLICO 2 (Todo MZ que não for público 1)
CREATE EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC2(
--CREATE TEMPORARY EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC2(
PENUMPER STRING
,COD_ENTIDAD STRING
,COD_CENTRO STRING
,COD_PRODUCTO STRING
,COD_SUBPRODU STRING
,NUM_CUENTA STRING
,NUM_SECUENCIA_CTO STRING
,PUBLIC STRING
,DIGIT_01 STRING
,SUB_SEG STRING
,COD_PROD STRING
,DIAS_ATRS INT
,LIMIT BIGINT
,AVAL_FIN STRING
,DT_REFE STRING
)
;



INSERT INTO TABLE CD_IFRS9.MZ_PUBLIC2
SELECT MZ.PENUMPER
       ,MZ.COD_ENTIDAD
       ,MZ.COD_CENTRO
       ,MZ.COD_PRODUCTO
       ,MZ.COD_SUBPRODU
       ,MZ.NUM_CUENTA
       ,MZ.NUM_SECUENCIA_CTO
       ,'2' PUBLIC
       ,'1' DIGIT_01
       ,MZ.SUB_SEG
       ,MZ.COD_PROD
       ,MZ.DIAS_ATRS
       ,MZ.LIMIT
       ,IF(MZ.SUB_SEG IN ('13','14','18','19','21','108','130','131','136','152','153','154','184','185','300'), '1',
         IF(MZ.SUB_SEG IN ('1','2','3','4','5','6','7','8','9','10','11','12','15','16','17','20','22','23','24'
                              ,'25','26','27','28','29','31','34','35','106','107','111','135','137','139','140'
                              ,'141','142','150','151','181','182','211','212','213','214','226','227','228'
                              ,'229','269','271','275','400','500'), '0',NULL)) AVAL_FIN
       ,MZ.DT_REFE
FROM
     CD_IFRS9.MZ_PUBLIC_SIT_GEST_TEMP MZ
LEFT JOIN
     CD_IFRS9.MZ_PUBLIC_1_1 MZ_01 ON
     (
          MZ.PENUMPER = MZ_01.PENUMPER
      AND MZ.DT_REFE = MZ_01.DT_REFE
     )
WHERE
     MZ.DT_REFE = '20170531'
 AND MZ_01.PENUMPER IS NOT NULL
;



DROP TABLE IF EXISTS CD_IFRS9.MZ_PUBLIC_2_1;
CREATE EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1(
PENUMPER STRING
,COD_ENTIDAD STRING
,COD_CENTRO STRING
,COD_PRODUCTO STRING
,COD_SUBPRODU STRING
,NUM_CUENTA STRING
,NUM_SECUENCIA_CTO STRING
,PUBLIC STRING
,DIGIT_01 STRING
,COD_PROD STRING
,DIAS_ATRS INT
,DNP_SUB STRING
,DT_REFE STRING
)
STORED AS TEXTFILE
LOCATION '/sistemas/ifr/ods/staging/MZ_SIT_GEST/MZ_PUBLIC_2_1';


-- 1ª MARCAÇÃO PARA O PUBLICO 2
INSERT INTO TABLE CD_IFRS9.MZ_PUBLIC_2_1
SELECT MZ_02.PENUMPER
       ,MZ_02.COD_ENTIDAD
       ,MZ_02.COD_CENTRO
       ,MZ_02.COD_PRODUCTO
       ,MZ_02.COD_SUBPRODU
       ,MZ_02.NUM_CUENTA
       ,MZ_02.NUM_SECUENCIA_CTO
       ,MZ_02.PUBLIC
       ,'1' DIGIT_01
       ,MZ_02.COD_PROD
       ,MZ_02.DIAS_ATRS
       ,'' DNP_SUB
       ,MZ_02.DT_REFE
FROM
     CD_IFRS9.MZ_PUBLIC2 MZ_02
WHERE
     MZ_02.DT_REFE = '20170531'
 AND MZ_02.DIAS_ATRS > 90 -- Dias em atraso
 AND MZ_02.AVAL_FIN = '0' --indicador de exclusão de fianças e avais = 0
;




INSERT INTO TABLE CD_IFRS9.MZ_PUBLIC_2_1
SELECT MZ_02.PENUMPER
       ,MZ_02.COD_ENTIDAD
       ,MZ_02.COD_CENTRO
       ,MZ_02.COD_PRODUCTO
       ,MZ_02.COD_SUBPRODU
       ,MZ_02.NUM_CUENTA
       ,MZ_02.NUM_SECUENCIA_CTO
       ,MZ_02.PUBLIC
       ,'1' DIGIT_01
       ,MZ_02.COD_PROD
       ,MZ_02.DIAS_ATRS
       ,'' DNP_SUB
       ,MZ_02.DT_REFE
FROM
     CD_IFRS9.MZ_PUBLIC2 MZ_02
LEFT JOIN
     CD_IFRS9.MZ_PUBLIC_2_1 MZ2 ON
     (
          MZ_02.PENUMPER = MZ2.PENUMPER
      AND MZ_02.COD_ENTIDAD       = MZ2.COD_ENTIDAD
      AND MZ_02.COD_CENTRO        = MZ2.COD_CENTRO
      AND MZ_02.COD_PRODUCTO      = MZ2.COD_PRODUCTO
      AND MZ_02.COD_SUBPRODU      = MZ2.COD_SUBPRODU
      AND MZ_02.NUM_CUENTA        = MZ2.NUM_CUENTA
      AND MZ_02.NUM_SECUENCIA_CTO = MZ2.NUM_SECUENCIA_CTO
      AND MZ_02.DT_REFE = MZ2.DT_REFE
     )
WHERE
     MZ_02.DT_REFE = '20170531'
 AND MZ2.PENUMPER IS NOT NULL
 AND MZ_02.AVAL_FIN = '1' --indicador de exclusão de fianças e avais = 1
 AND (MZ_02.LIMIT / IF(MZ_02.SUB_SEG IN ('21','154'),10000,1000)) > 0.10 --Limites / Piso (10000 ou 1000) > 10%
;





-- 2ª MARCAÇÃO PARA O PUBLICO 2
CREATE EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1_2(
--CREATE TEMPORARY EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1_2(
PENUMPER STRING
,COD_ENTIDAD STRING
,COD_CENTRO STRING
,COD_PRODUCTO STRING
,COD_SUBPRODU STRING
,NUM_CUENTA STRING
,NUM_SECUENCIA_CTO STRING
,PUBLIC STRING
,DIGIT_01 STRING
,COD_PROD STRING
,DIAS_ATRS INT
,DNP_SUB STRING
,DT_REFE STRING
)
;


INSERT OVERWRITE TABLE CD_IFRS9.MZ_PUBLIC_2_1_2
SELECT MZ_02.PENUMPER
       ,MZ_02.COD_ENTIDAD
       ,MZ_02.COD_CENTRO
       ,MZ_02.COD_PRODUCTO
       ,MZ_02.COD_SUBPRODU
       ,MZ_02.NUM_CUENTA
       ,MZ_02.NUM_SECUENCIA_CTO
       ,MZ_02.PUBLIC
       ,'1' DIGIT_01
       ,MZ_02.COD_PROD
       ,MZ_02.DIAS_ATRS
       ,'' DNP_SUB
       ,MZ_02.DT_REFE
FROM
     CD_IFRS9.MZ_PUBLIC2 MZ_02
LEFT JOIN
     CD_IFRS9.MZ_PUBLIC_2_1 MZ2 ON
     (
          MZ_02.PENUMPER = MZ2.PENUMPER
      AND MZ_02.COD_ENTIDAD       = MZ2.COD_ENTIDAD
      AND MZ_02.COD_CENTRO        = MZ2.COD_CENTRO
      AND MZ_02.COD_PRODUCTO      = MZ2.COD_PRODUCTO
      AND MZ_02.COD_SUBPRODU      = MZ2.COD_SUBPRODU
      AND MZ_02.NUM_CUENTA        = MZ2.NUM_CUENTA
      AND MZ_02.NUM_SECUENCIA_CTO = MZ2.NUM_SECUENCIA_CTO
      AND MZ_02.DT_REFE = MZ2.DT_REFE
     )
WHERE
     MZ_02.DT_REFE = '20170531'
 AND MZ2.PENUMPER IS NOT NULL
  AND MZ_02.DIAS_ATRS < 90 -- Dias em atraso
  AND MZ_02.COD_PROD IN ('1679','1708','1709','1711')
  -- Produtos Refin (refinanciamento)
;

INSERT INTO TABLE CD_IFRS9.MZ_PUBLIC_2_1
SELECT  MZ_2_2.PENUMPER
       ,MZ_2_2.COD_ENTIDAD
       ,MZ_2_2.COD_CENTRO
       ,MZ_2_2.COD_PRODUCTO
       ,MZ_2_2.COD_SUBPRODU
       ,MZ_2_2.NUM_CUENTA
       ,MZ_2_2.NUM_SECUENCIA_CTO
       ,MZ_2_2.PUBLIC
       ,MZ_2_2.DIGIT_01
       ,MZ_2_2.COD_PROD
       ,MZ_2_2.DIAS_ATRS
       ,MZ_2_2.DNP_SUB
       ,MZ_2_2.DT_REFE
FROM
      CD_IFRS9.MZ_PUBLIC_2_1_2 MZ_2_2
;



-- 3ª MARCAÇÃO PARA O PUBLICO 2
CREATE EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1_3(
--CREATE TEMPORARY EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1_3(
PENUMPER STRING
,COD_ENTIDAD STRING
,COD_CENTRO STRING
,COD_PRODUCTO STRING
,COD_SUBPRODU STRING
,NUM_CUENTA STRING
,NUM_SECUENCIA_CTO STRING
,PUBLIC STRING
,DIGIT_01 STRING
,COD_PROD STRING
,DIAS_ATRS INT
,DNP_SUB STRING
,DT_REFE STRING
)
;


INSERT OVERWRITE TABLE CD_IFRS9.MZ_PUBLIC_2_1_3
SELECT MZ_02.PENUMPER
       ,MZ_02.COD_ENTIDAD
       ,MZ_02.COD_CENTRO
       ,MZ_02.COD_PRODUCTO
       ,MZ_02.COD_SUBPRODU
       ,MZ_02.NUM_CUENTA
       ,MZ_02.NUM_SECUENCIA_CTO
       ,MZ_02.PUBLIC
       ,'3' DIGIT_01
       ,MZ_02.COD_PROD
       ,MZ_02.DIAS_ATRS
       ,'' DNP_SUB
       ,MZ_02.DT_REFE
FROM
     CD_IFRS9.MZ_PUBLIC2 MZ_02
LEFT JOIN
     CD_IFRS9.MZ_PUBLIC_2_1 MZ2 ON
     (
          MZ_02.PENUMPER = MZ2.PENUMPER
      AND MZ_02.COD_ENTIDAD       = MZ2.COD_ENTIDAD
      AND MZ_02.COD_CENTRO        = MZ2.COD_CENTRO
      AND MZ_02.COD_PRODUCTO      = MZ2.COD_PRODUCTO
      AND MZ_02.COD_SUBPRODU      = MZ2.COD_SUBPRODU
      AND MZ_02.NUM_CUENTA        = MZ2.NUM_CUENTA
      AND MZ_02.NUM_SECUENCIA_CTO = MZ2.NUM_SECUENCIA_CTO
      AND MZ_02.DT_REFE = MZ2.DT_REFE
     )
WHERE
     MZ_02.DT_REFE = '20170531'
 AND MZ2.PENUMPER IS NOT NULL
  AND MZ_02.AVAL_FIN = '1'
  AND MZ_02.DIAS_ATRS < 90 -- Dias em atraso
  AND MZ_02.COD_PROD IN ('1679','1708','1709','1711')
  -- Produtos Refin (refinanciamento)
;

INSERT INTO TABLE CD_IFRS9.MZ_PUBLIC_2_1
SELECT  MZ_2_3.PENUMPER
       ,MZ_2_3.COD_ENTIDAD
       ,MZ_2_3.COD_CENTRO
       ,MZ_2_3.COD_PRODUCTO
       ,MZ_2_3.COD_SUBPRODU
       ,MZ_2_3.NUM_CUENTA
       ,MZ_2_3.NUM_SECUENCIA_CTO
       ,MZ_2_3.PUBLIC
       ,MZ_2_3.DIGIT_01
       ,MZ_2_3.COD_PROD
       ,MZ_2_3.DIAS_ATRS
       ,MZ_2_3.DNP_SUB
       ,MZ_2_3.DT_REFE
FROM
      CD_IFRS9.MZ_PUBLIC_2_1_3 MZ_2_3
;






-- 4ª MARCAÇÃO PARA O PUBLICO 2
CREATE EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1_4(
--CREATE TEMPORARY EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1_4(
PENUMPER STRING
,COD_ENTIDAD STRING
,COD_CENTRO STRING
,COD_PRODUCTO STRING
,COD_SUBPRODU STRING
,NUM_CUENTA STRING
,NUM_SECUENCIA_CTO STRING
,PUBLIC STRING
,DIGIT_01 STRING
,COD_PROD STRING
,DIAS_ATRS INT
,DNP_SUB STRING
,DT_REFE STRING
)
;


INSERT OVERWRITE TABLE CD_IFRS9.MZ_PUBLIC_2_1_4
SELECT MZ_02.PENUMPER
       ,MZ_02.COD_ENTIDAD
       ,MZ_02.COD_CENTRO
       ,MZ_02.COD_PRODUCTO
       ,MZ_02.COD_SUBPRODU
       ,MZ_02.NUM_CUENTA
       ,MZ_02.NUM_SECUENCIA_CTO
       ,MZ_02.PUBLIC
       ,'2' DIGIT_01
       ,MZ_02.COD_PROD
       ,MZ_02.DIAS_ATRS
       ,'DNP' DNP_SUB
       ,MZ_02.DT_REFE
FROM
     CD_IFRS9.MZ_PUBLIC2 MZ_02
INNER JOIN
      CD_IFRS9.CAL_GF0_0052_M GF ON
     (
          MZ_02.PENUMPER = GF.NUM_PERSONA
      AND MZ_02.DT_REFE = GF.DT_REFE
      AND GF.COD_GRADOGYS = '06' --Classificação DNP
     )
LEFT JOIN
     CD_IFRS9.MZ_PUBLIC_2_1 MZ2 ON
     (
          MZ_02.PENUMPER = MZ2.PENUMPER
      AND MZ_02.COD_ENTIDAD       = MZ2.COD_ENTIDAD
      AND MZ_02.COD_CENTRO        = MZ2.COD_CENTRO
      AND MZ_02.COD_PRODUCTO      = MZ2.COD_PRODUCTO
      AND MZ_02.COD_SUBPRODU      = MZ2.COD_SUBPRODU
      AND MZ_02.NUM_CUENTA        = MZ2.NUM_CUENTA
      AND MZ_02.NUM_SECUENCIA_CTO = MZ2.NUM_SECUENCIA_CTO
      AND MZ_02.DT_REFE = MZ2.DT_REFE
     )
WHERE
     MZ_02.DT_REFE = '20170531'
 AND MZ2.PENUMPER IS NOT NULL
;

INSERT INTO TABLE CD_IFRS9.MZ_PUBLIC_2_1
SELECT  MZ_2_4.PENUMPER
       ,MZ_2_4.COD_ENTIDAD
       ,MZ_2_4.COD_CENTRO
       ,MZ_2_4.COD_PRODUCTO
       ,MZ_2_4.COD_SUBPRODU
       ,MZ_2_4.NUM_CUENTA
       ,MZ_2_4.NUM_SECUENCIA_CTO
       ,MZ_2_4.PUBLIC
       ,MZ_2_4.DIGIT_01
       ,MZ_2_4.COD_PROD
       ,MZ_2_4.DIAS_ATRS
       ,MZ_2_4.DNP_SUB
       ,MZ_2_4.DT_REFE
FROM
      CD_IFRS9.MZ_PUBLIC_2_1_4 MZ_2_4
;




-- 5ª MARCAÇÃO PARA O PUBLICO 2
CREATE EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1_5(
--CREATE TEMPORARY EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1_5(
PENUMPER STRING
,COD_ENTIDAD STRING
,COD_CENTRO STRING
,COD_PRODUCTO STRING
,COD_SUBPRODU STRING
,NUM_CUENTA STRING
,NUM_SECUENCIA_CTO STRING
,PUBLIC STRING
,DIGIT_01 STRING
,COD_PROD STRING
,DIAS_ATRS INT
,DNP_SUB STRING
,DT_REFE STRING
)
;


INSERT OVERWRITE TABLE CD_IFRS9.MZ_PUBLIC_2_1_5
SELECT MZ_02.PENUMPER
       ,MZ_02.COD_ENTIDAD
       ,MZ_02.COD_CENTRO
       ,MZ_02.COD_PRODUCTO
       ,MZ_02.COD_SUBPRODU
       ,MZ_02.NUM_CUENTA
       ,MZ_02.NUM_SECUENCIA_CTO
       ,MZ_02.PUBLIC
       ,'8' DIGIT_01
       ,MZ_02.COD_PROD
       ,MZ_02.DIAS_ATRS
       ,'SUB' DNP_SUB
       ,MZ_02.DT_REFE
FROM
     CD_IFRS9.MZ_PUBLIC2 MZ_02
INNER JOIN
      CD_IFRS9.CAL_GF0_0052_M GF ON
     (
          MZ_02.PENUMPER = GF.NUM_PERSONA
      AND MZ_02.DT_REFE = GF.DT_REFE
      AND GF.COD_GRADOGYS = '05' --Classificação SUBSTANDARD
     )
LEFT JOIN
     CD_IFRS9.MZ_PUBLIC_2_1 MZ2 ON
     (
          MZ_02.PENUMPER = MZ2.PENUMPER
      AND MZ_02.COD_ENTIDAD       = MZ2.COD_ENTIDAD
      AND MZ_02.COD_CENTRO        = MZ2.COD_CENTRO
      AND MZ_02.COD_PRODUCTO      = MZ2.COD_PRODUCTO
      AND MZ_02.COD_SUBPRODU      = MZ2.COD_SUBPRODU
      AND MZ_02.NUM_CUENTA        = MZ2.NUM_CUENTA
      AND MZ_02.NUM_SECUENCIA_CTO = MZ2.NUM_SECUENCIA_CTO
      AND MZ_02.DT_REFE = MZ2.DT_REFE
     )
WHERE
     MZ_02.DT_REFE = '20170531'
 AND MZ2.PENUMPER IS NOT NULL
;

INSERT INTO TABLE CD_IFRS9.MZ_PUBLIC_2_1
SELECT  MZ_2_5.PENUMPER
       ,MZ_2_5.COD_ENTIDAD
       ,MZ_2_5.COD_CENTRO
       ,MZ_2_5.COD_PRODUCTO
       ,MZ_2_5.COD_SUBPRODU
       ,MZ_2_5.NUM_CUENTA
       ,MZ_2_5.NUM_SECUENCIA_CTO
       ,MZ_2_5.PUBLIC
       ,MZ_2_5.DIGIT_01
       ,MZ_2_5.COD_PROD
       ,MZ_2_5.DIAS_ATRS
       ,MZ_2_5.DNP_SUB
       ,MZ_2_5.DT_REFE
FROM
      CD_IFRS9.MZ_PUBLIC_2_1_5 MZ_2_5
;





-- 6ª MARCAÇÃO PARA O PUBLICO 2
CREATE EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1_6(
--CREATE TEMPORARY EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1_6(
PENUMPER STRING
,COD_ENTIDAD STRING
,COD_CENTRO STRING
,COD_PRODUCTO STRING
,COD_SUBPRODU STRING
,NUM_CUENTA STRING
,NUM_SECUENCIA_CTO STRING
,PUBLIC STRING
,DIGIT_01 STRING
,COD_PROD STRING
,DIAS_ATRS INT
,DNP_SUB STRING
,DT_REFE STRING
)
;


INSERT OVERWRITE TABLE CD_IFRS9.MZ_PUBLIC_2_1_6
SELECT MZ_02.PENUMPER
       ,MZ_02.COD_ENTIDAD
       ,MZ_02.COD_CENTRO
       ,MZ_02.COD_PRODUCTO
       ,MZ_02.COD_SUBPRODU
       ,MZ_02.NUM_CUENTA
       ,MZ_02.NUM_SECUENCIA_CTO
       ,MZ_02.PUBLIC
       ,'7' DIGIT_01
       ,MZ_02.COD_PROD
       ,MZ_02.DIAS_ATRS
       ,'' DNP_SUB
       ,MZ_02.DT_REFE
FROM
     CD_IFRS9.MZ_PUBLIC2 MZ_02
LEFT JOIN
     CD_IFRS9.MZ_PUBLIC_2_1 MZ2 ON
     (
          MZ_02.PENUMPER = MZ2.PENUMPER
      AND MZ_02.COD_ENTIDAD       = MZ2.COD_ENTIDAD
      AND MZ_02.COD_CENTRO        = MZ2.COD_CENTRO
      AND MZ_02.COD_PRODUCTO      = MZ2.COD_PRODUCTO
      AND MZ_02.COD_SUBPRODU      = MZ2.COD_SUBPRODU
      AND MZ_02.NUM_CUENTA        = MZ2.NUM_CUENTA
      AND MZ_02.NUM_SECUENCIA_CTO = MZ2.NUM_SECUENCIA_CTO
      AND MZ_02.DT_REFE = MZ2.DT_REFE
     )
WHERE
     MZ_02.DT_REFE = '20170531'
 AND MZ2.PENUMPER IS NOT NULL
  AND MZ_02.AVAL_FIN = '1'
  AND MZ_02.DIAS_ATRS > 90 -- Dias em atraso
;

INSERT INTO TABLE CD_IFRS9.MZ_PUBLIC_2_1
SELECT  MZ_2_6.PENUMPER
       ,MZ_2_6.COD_ENTIDAD
       ,MZ_2_6.COD_CENTRO
       ,MZ_2_6.COD_PRODUCTO
       ,MZ_2_6.COD_SUBPRODU
       ,MZ_2_6.NUM_CUENTA
       ,MZ_2_6.NUM_SECUENCIA_CTO
       ,MZ_2_6.PUBLIC
       ,MZ_2_6.DIGIT_01
       ,MZ_2_6.COD_PROD
       ,MZ_2_6.DIAS_ATRS
       ,MZ_2_6.DNP_SUB
       ,MZ_2_6.DT_REFE
FROM
      CD_IFRS9.MZ_PUBLIC_2_1_6 MZ_2_6
;





-- 7ª MARCAÇÃO PARA O PUBLICO 2
CREATE EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1_7(
--CREATE TEMPORARY EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1_7(
PENUMPER STRING
,COD_ENTIDAD STRING
,COD_CENTRO STRING
,COD_PRODUCTO STRING
,COD_SUBPRODU STRING
,NUM_CUENTA STRING
,NUM_SECUENCIA_CTO STRING
,PUBLIC STRING
,DIGIT_01 STRING
,COD_PROD STRING
,DIAS_ATRS INT
,DNP_SUB STRING
,DT_REFE STRING
)
;


INSERT OVERWRITE TABLE CD_IFRS9.MZ_PUBLIC_2_1_7
SELECT MZ_02.PENUMPER
       ,MZ_02.COD_ENTIDAD
       ,MZ_02.COD_CENTRO
       ,MZ_02.COD_PRODUCTO
       ,MZ_02.COD_SUBPRODU
       ,MZ_02.NUM_CUENTA
       ,MZ_02.NUM_SECUENCIA_CTO
       ,MZ_02.PUBLIC
       ,IF(MZ_PUB.DIGIT_01 = '2','6','') DIGIT_01
       ,MZ_02.COD_PROD
       ,MZ_02.DIAS_ATRS
       ,'' DNP_SUB
       ,MZ_02.DT_REFE
FROM
     CD_IFRS9.MZ_PUBLIC2 MZ_02
INNER JOIN
     CD_IFRS9.MZ_SIT_GEST MZ_PUB ON
     (
          MZ_02.PENUMPER = MZ_PUB.PENUMPER
     )
LEFT JOIN
     CD_IFRS9.MZ_PUBLIC_2_1 MZ2 ON
     (
          MZ_02.PENUMPER = MZ2.PENUMPER
      AND MZ_02.COD_ENTIDAD       = MZ2.COD_ENTIDAD
      AND MZ_02.COD_CENTRO        = MZ2.COD_CENTRO
      AND MZ_02.COD_PRODUCTO      = MZ2.COD_PRODUCTO
      AND MZ_02.COD_SUBPRODU      = MZ2.COD_SUBPRODU
      AND MZ_02.NUM_CUENTA        = MZ2.NUM_CUENTA
      AND MZ_02.NUM_SECUENCIA_CTO = MZ2.NUM_SECUENCIA_CTO
      AND MZ_02.DT_REFE = MZ2.DT_REFE
     )
WHERE
     MZ_02.DT_REFE = '20170531'
 AND MZ2.PENUMPER IS NOT NULL
 AND (CAST(MZ_02.DT_REFE AS BIGINT) - CAST(MZ_PUB.DT_REFE AS BIGINT)) > 99
;

INSERT INTO TABLE CD_IFRS9.MZ_PUBLIC_2_1
SELECT  MZ_2_7.PENUMPER
       ,MZ_2_7.COD_ENTIDAD
       ,MZ_2_7.COD_CENTRO
       ,MZ_2_7.COD_PRODUCTO
       ,MZ_2_7.COD_SUBPRODU
       ,MZ_2_7.NUM_CUENTA
       ,MZ_2_7.NUM_SECUENCIA_CTO
       ,MZ_2_7.PUBLIC
       ,MZ_2_7.DIGIT_01
       ,MZ_2_7.COD_PROD
       ,MZ_2_7.DIAS_ATRS
       ,MZ_2_7.DNP_SUB
       ,MZ_2_7.DT_REFE
FROM
      CD_IFRS9.MZ_PUBLIC_2_1_7 MZ_2_7
;






-- 8ª MARCAÇÃO PARA O PUBLICO 2
CREATE EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1_8(
--CREATE TEMPORARY EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1_8(
PENUMPER STRING
,COD_ENTIDAD STRING
,COD_CENTRO STRING
,COD_PRODUCTO STRING
,COD_SUBPRODU STRING
,NUM_CUENTA STRING
,NUM_SECUENCIA_CTO STRING
,PUBLIC STRING
,DIGIT_01 STRING
,COD_PROD STRING
,DIAS_ATRS INT
,DNP_SUB STRING
,DT_REFE STRING
)
;


INSERT OVERWRITE TABLE CD_IFRS9.MZ_PUBLIC_2_1_8
SELECT MZ_02.PENUMPER
       ,MZ_02.COD_ENTIDAD
       ,MZ_02.COD_CENTRO
       ,MZ_02.COD_PRODUCTO
       ,MZ_02.COD_SUBPRODU
       ,MZ_02.NUM_CUENTA
       ,MZ_02.NUM_SECUENCIA_CTO
       ,MZ_02.PUBLIC
       ,IF(MZ_PUB.DIGIT_01 = '8','9', '') DIGIT_01
       ,MZ_02.COD_PROD
       ,MZ_02.DIAS_ATRS
       ,'' DNP_SUB
       ,MZ_02.DT_REFE
FROM
     CD_IFRS9.MZ_PUBLIC2 MZ_02
INNER JOIN
     CD_IFRS9.MZ_SIT_GEST MZ_PUB ON
     (
          MZ_02.PENUMPER = MZ_PUB.PENUMPER
     )
LEFT JOIN
     CD_IFRS9.MZ_PUBLIC_2_1 MZ2 ON
     (
          MZ_02.PENUMPER = MZ2.PENUMPER
      AND MZ_02.COD_ENTIDAD       = MZ2.COD_ENTIDAD
      AND MZ_02.COD_CENTRO        = MZ2.COD_CENTRO
      AND MZ_02.COD_PRODUCTO      = MZ2.COD_PRODUCTO
      AND MZ_02.COD_SUBPRODU      = MZ2.COD_SUBPRODU
      AND MZ_02.NUM_CUENTA        = MZ2.NUM_CUENTA
      AND MZ_02.NUM_SECUENCIA_CTO = MZ2.NUM_SECUENCIA_CTO
      AND MZ_02.DT_REFE = MZ2.DT_REFE
     )
WHERE
     MZ_02.DT_REFE = '20170531'
 AND MZ2.PENUMPER IS NOT NULL
 AND (CAST(MZ_02.DT_REFE AS BIGINT) - CAST(MZ_PUB.DT_REFE AS BIGINT)) > 99
;

INSERT INTO TABLE CD_IFRS9.MZ_PUBLIC_2_1
SELECT  MZ_2_8.PENUMPER
       ,MZ_2_8.COD_ENTIDAD
       ,MZ_2_8.COD_CENTRO
       ,MZ_2_8.COD_PRODUCTO
       ,MZ_2_8.COD_SUBPRODU
       ,MZ_2_8.NUM_CUENTA
       ,MZ_2_8.NUM_SECUENCIA_CTO
       ,MZ_2_8.PUBLIC
       ,MZ_2_8.DIGIT_01
       ,MZ_2_8.COD_PROD
       ,MZ_2_8.DIAS_ATRS
       ,MZ_2_8.DNP_SUB
       ,MZ_2_8.DT_REFE
FROM
      CD_IFRS9.MZ_PUBLIC_2_1_8 MZ_2_8
;






-- 9ª MARCAÇÃO PARA O PUBLICO 2
CREATE EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1_9(
--CREATE TEMPORARY EXTERNAL TABLE CD_IFRS9.MZ_PUBLIC_2_1_9(
PENUMPER STRING
,COD_ENTIDAD STRING
,COD_CENTRO STRING
,COD_PRODUCTO STRING
,COD_SUBPRODU STRING
,NUM_CUENTA STRING
,NUM_SECUENCIA_CTO STRING
,PUBLIC STRING
,DIGIT_01 STRING
,COD_PROD STRING
,DIAS_ATRS INT
,DNP_SUB STRING
,DT_REFE STRING
)
;


INSERT OVERWRITE TABLE CD_IFRS9.MZ_PUBLIC_2_1_9
SELECT MZ_02.PENUMPER
       ,MZ_02.COD_ENTIDAD
       ,MZ_02.COD_CENTRO
       ,MZ_02.COD_PRODUCTO
       ,MZ_02.COD_SUBPRODU
       ,MZ_02.NUM_CUENTA
       ,MZ_02.NUM_SECUENCIA_CTO
       ,MZ_02.PUBLIC
       ,IF(MZ_PUB.DIGIT_01 = '1','5', '') DIGIT_01
       ,MZ_02.COD_PROD
       ,MZ_02.DIAS_ATRS
       ,'' DNP_SUB
       ,MZ_02.DT_REFE
FROM
     CD_IFRS9.MZ_PUBLIC2 MZ_02
INNER JOIN
     CD_IFRS9.MZ_SIT_GEST MZ_PUB ON
     (
          MZ_02.PENUMPER = MZ_PUB.PENUMPER
     )
LEFT JOIN
     CD_IFRS9.MZ_PUBLIC_2_1 MZ2 ON
     (
          MZ_02.PENUMPER = MZ2.PENUMPER
      AND MZ_02.COD_ENTIDAD       = MZ2.COD_ENTIDAD
      AND MZ_02.COD_CENTRO        = MZ2.COD_CENTRO
      AND MZ_02.COD_PRODUCTO      = MZ2.COD_PRODUCTO
      AND MZ_02.COD_SUBPRODU      = MZ2.COD_SUBPRODU
      AND MZ_02.NUM_CUENTA        = MZ2.NUM_CUENTA
      AND MZ_02.NUM_SECUENCIA_CTO = MZ2.NUM_SECUENCIA_CTO
      AND MZ_02.DT_REFE = MZ2.DT_REFE
     )
WHERE
     MZ_02.DT_REFE = '20170531'
 AND MZ2.PENUMPER IS NOT NULL
 AND (CAST(MZ_02.DT_REFE AS BIGINT) - CAST(MZ_PUB.DT_REFE AS BIGINT)) > 99
;

INSERT INTO TABLE CD_IFRS9.MZ_PUBLIC_2_1
SELECT  MZ_2_9.PENUMPER
       ,MZ_2_9.COD_ENTIDAD
       ,MZ_2_9.COD_CENTRO
       ,MZ_2_9.COD_PRODUCTO
       ,MZ_2_9.COD_SUBPRODU
       ,MZ_2_9.NUM_CUENTA
       ,MZ_2_9.NUM_SECUENCIA_CTO
       ,MZ_2_9.PUBLIC
       ,MZ_2_9.DIGIT_01
       ,MZ_2_9.COD_PROD
       ,MZ_2_9.DIAS_ATRS
       ,MZ_2_9.DNP_SUB
       ,MZ_2_9.DT_REFE
FROM
      CD_IFRS9.MZ_PUBLIC_2_1_9 MZ_2_9
;




-- 10ª MARCAÇÃO PARA O PUBLICO 2
INSERT INTO TABLE CD_IFRS9.MZ_PUBLIC_2_1
SELECT MZ_02.PENUMPER
       ,MZ_02.COD_ENTIDAD
       ,MZ_02.COD_CENTRO
       ,MZ_02.COD_PRODUCTO
       ,MZ_02.COD_SUBPRODU
       ,MZ_02.NUM_CUENTA
       ,MZ_02.NUM_SECUENCIA_CTO
       ,MZ_02.PUBLIC
       ,'0' DIGIT_01
       ,MZ_02.COD_PROD
       ,MZ_02.DIAS_ATRS
       ,'' DNP_SUB
       ,MZ_02.DT_REFE
FROM
     CD_IFRS9.MZ_PUBLIC2 MZ_02
LEFT JOIN
     CD_IFRS9.MZ_PUBLIC_2_1 MZ2 ON
     (
          MZ_02.PENUMPER = MZ2.PENUMPER
      AND MZ_02.COD_ENTIDAD       = MZ2.COD_ENTIDAD
      AND MZ_02.COD_CENTRO        = MZ2.COD_CENTRO
      AND MZ_02.COD_PRODUCTO      = MZ2.COD_PRODUCTO
      AND MZ_02.COD_SUBPRODU      = MZ2.COD_SUBPRODU
      AND MZ_02.NUM_CUENTA        = MZ2.NUM_CUENTA
      AND MZ_02.NUM_SECUENCIA_CTO = MZ2.NUM_SECUENCIA_CTO
      AND MZ_02.DT_REFE = MZ2.DT_REFE
     )
WHERE
     MZ_02.DT_REFE = '20170531'
 AND MZ2.PENUMPER IS NOT NULL
;