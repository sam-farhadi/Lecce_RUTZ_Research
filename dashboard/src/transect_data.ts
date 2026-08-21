/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TransectPoint {
  objectId: number;
  distance: number;
  clc: string;
  urbanAtlas: string;
  // Metrics: [LST, NDVI, NDMI, BSI]
  summer2015: [number, number, number, number];
  summer2025: [number, number, number, number];
  spring2015: [number, number, number, number];
  spring2025: [number, number, number, number];
  winter2015: [number, number, number, number];
  winter2025: [number, number, number, number];
}

export const transectData: TransectPoint[] = [
  {
    objectId: 1, distance: 0, clc: "Sealed", urbanAtlas: "Discontinuous dense urban fabric (S.L. : 50% - 80%)",
    summer2015: [43.5, 0.1127, -0.1832, 0.2001], summer2025: [42.8, 0.1225, -0.0950, 0.1408],
    spring2015: [30.4, 0.0896, -0.1590, 0.1945], spring2025: [30.6, 0.1222, -0.1124, 0.1329],
    winter2015: [10.0, 0.1604, -0.1173, 0.1610], winter2025: [13.3, 0.1290, -0.1027, 0.1682]
  },
  {
    objectId: 2, distance: 50, clc: "Sealed", urbanAtlas: "Discontinuous dense urban fabric (S.L. : 50% - 80%)",
    summer2015: [44.4, 0.1953, -0.1003, 0.1521], summer2025: [43.2, 0.2118, -0.1605, 0.1880],
    spring2015: [30.8, 0.2516, -0.1797, 0.2074], spring2025: [30.9, 0.1961, -0.1631, 0.1903],
    winter2015: [10.4, 0.2423, -0.1077, 0.1800], winter2025: [13.8, 0.3265, -0.0811, 0.1345]
  },
  {
    objectId: 3, distance: 100, clc: "Woody broadleaved evergreen trees", urbanAtlas: "Discontinuous dense urban fabric (S.L. : 50% - 80%)",
    summer2015: [45.2, 0.2212, -0.2223, 0.2112], summer2025: [43.2, 0.2337, -0.1707, 0.1860],
    spring2015: [31.2, 0.2851, -0.1355, 0.1588], spring2025: [31.3, 0.2607, -0.2001, 0.2066],
    winter2015: [10.4, 0.3023, -0.2382, 0.1846], winter2025: [13.7, 0.4030, -0.0569, 0.0963]
  },
  {
    objectId: 4, distance: 150, clc: "Sealed", urbanAtlas: "Other roads and associated land",
    summer2015: [44.7, 0.2115, -0.1194, 0.1346], summer2025: [43.0, 0.2007, -0.1144, 0.1531],
    spring2015: [31.0, 0.2061, -0.0927, 0.1131], spring2025: [30.7, 0.2226, -0.1303, 0.1657],
    winter2015: [10.2, 0.2275, -0.0571, 0.0941], winter2025: [13.5, 0.3673, -0.0372, 0.1349]
  },
  {
    objectId: 5, distance: 200, clc: "Sealed", urbanAtlas: "Discontinuous dense urban fabric (S.L. : 50% - 80%)",
    summer2015: [44.8, 0.1860, -0.0269, 0.0985], summer2025: [43.3, 0.1939, -0.1321, 0.1569],
    spring2015: [31.3, 0.1772, -0.0588, 0.1317], spring2025: [30.8, 0.2272, -0.0858, 0.1494],
    winter2015: [10.5, 0.1924, -0.1506, 0.1848], winter2025: [13.8, 0.3178, -0.0223, 0.0956]
  },
  {
    objectId: 6, distance: 250, clc: "Sealed", urbanAtlas: "Other roads and associated land",
    summer2015: [45.1, 0.2107, -0.1572, 0.1914], summer2025: [43.5, 0.2129, -0.1801, 0.2236],
    spring2015: [31.5, 0.2462, -0.1994, 0.2218], spring2025: [30.9, 0.2159, -0.1307, 0.1734],
    winter2015: [10.7, 0.2772, -0.1237, 0.1646], winter2025: [13.9, 0.3324, -0.1281, 0.1950]
  },
  {
    objectId: 7, distance: 300, clc: "Sealed", urbanAtlas: "Discontinuous medium density urban fabric (S.L. : 30% - 50%)",
    summer2015: [45.3, 0.2360, -0.1039, 0.1465], summer2025: [43.4, 0.2345, -0.1318, 0.1859],
    spring2015: [31.6, 0.2775, -0.1519, 0.1875], spring2025: [31.1, 0.2734, -0.1262, 0.1517],
    winter2015: [10.7, 0.2464, -0.0770, 0.1439], winter2025: [13.9, 0.3427, -0.0677, 0.1331]
  },
  {
    objectId: 8, distance: 350, clc: "Sealed", urbanAtlas: "Discontinuous medium density urban fabric (S.L. : 30% - 50%)",
    summer2015: [45.0, 0.2274, -0.1250, 0.1701], summer2025: [43.0, 0.2213, -0.1912, 0.2224],
    spring2015: [31.4, 0.2642, -0.2035, 0.2120], spring2025: [30.8, 0.2513, -0.1867, 0.1927],
    winter2015: [10.5, 0.2954, -0.0665, 0.1422], winter2025: [13.7, 0.3450, -0.1115, 0.1626]
  },
  {
    objectId: 9, distance: 400, clc: "Sealed", urbanAtlas: "Discontinuous medium density urban fabric (S.L. : 30% - 50%)",
    summer2015: [45.6, 0.1966, -0.1689, 0.1902], summer2025: [43.6, 0.2166, -0.1507, 0.1797],
    spring2015: [31.6, 0.1957, -0.1703, 0.1659], spring2025: [30.8, 0.2095, -0.1468, 0.1651],
    winter2015: [10.7, 0.2829, -0.1109, 0.1400], winter2025: [14.0, 0.2989, -0.0699, 0.1096]
  },
  {
    objectId: 10, distance: 450, clc: "Sealed", urbanAtlas: "Other roads and associated land",
    summer2015: [45.7, 0.1901, -0.1279, 0.1736], summer2025: [43.6, 0.1977, -0.1724, 0.1986],
    spring2015: [31.6, 0.1922, -0.1523, 0.1663], spring2025: [30.8, 0.1666, -0.1380, 0.1735],
    winter2015: [10.7, 0.2556, -0.1266, 0.1834], winter2025: [13.9, 0.3130, -0.1045, 0.1627]
  },
  {
    objectId: 11, distance: 500, clc: "Sealed", urbanAtlas: "Continuous urban fabric (S.L. : > 80%)",
    summer2015: [45.2, 0.2008, -0.1093, 0.1499], summer2025: [43.1, 0.2100, -0.1265, 0.1691],
    spring2015: [31.2, 0.2082, -0.2119, 0.2040], spring2025: [30.8, 0.1813, -0.1342, 0.1562],
    winter2015: [10.5, 0.2416, -0.0305, 0.1068], winter2025: [13.8, 0.2801, -0.1130, 0.1701]
  },
  {
    objectId: 12, distance: 550, clc: "Sealed", urbanAtlas: "Continuous urban fabric (S.L. : > 80%)",
    summer2015: [44.2, 0.2284, -0.0407, 0.1147], summer2025: [42.2, 0.2443, -0.0863, 0.1474],
    spring2015: [30.7, 0.3180, -0.0945, 0.1353], spring2025: [30.2, 0.3251, -0.0476, 0.1052],
    winter2015: [10.3, 0.2386, -0.0199, 0.1519], winter2025: [13.8, 0.3532, 0.0356, 0.0777]
  },
  {
    objectId: 13, distance: 600, clc: "Sealed", urbanAtlas: "Discontinuous medium density urban fabric (S.L. : 30% - 50%)",
    summer2015: [44.0, 0.3830, 0.1015, -0.0383], summer2025: [42.0, 0.4610, 0.1031, -0.0224],
    spring2015: [30.6, 0.3858, 0.0409, 0.0469], spring2025: [29.9, 0.5328, 0.1601, -0.0606],
    winter2015: [10.3, 0.4076, 0.1759, -0.0816], winter2025: [13.9, 0.6042, 0.2054, -0.1227]
  },
  {
    objectId: 14, distance: 650, clc: "Sealed", urbanAtlas: "Discontinuous medium density urban fabric (S.L. : 30% - 50%)",
    summer2015: [44.5, 0.3320, 0.0630, 0.0253], summer2025: [42.2, 0.3973, 0.0706, 0.0101],
    spring2015: [30.4, 0.2274, -0.0240, 0.0954], spring2025: [29.8, 0.3976, 0.0499, 0.0203],
    winter2015: [10.7, 0.3759, 0.0673, 0.0053], winter2025: [14.4, 0.5633, 0.1812, -0.0996]
  },
  {
    objectId: 15, distance: 700, clc: "Sealed", urbanAtlas: "Sports and leisure facilities",
    summer2015: [44.9, 0.1998, -0.0704, 0.1352], summer2025: [42.6, 0.4131, 0.0708, 0.0311],
    spring2015: [30.1, 0.2783, -0.0567, 0.1327], spring2025: [29.6, 0.4520, 0.0428, 0.0435],
    winter2015: [10.8, 0.2779, 0.0692, 0.0499], winter2025: [14.6, 0.5347, 0.2065, -0.0916]
  },
  {
    objectId: 16, distance: 750, clc: "Permanent herbaceous", urbanAtlas: "Sports and leisure facilities",
    summer2015: [45.9, 0.1716, -0.1415, 0.1783], summer2025: [43.5, 0.4618, 0.0830, 0.0053],
    spring2015: [30.4, 0.2687, -0.0452, 0.1137], spring2025: [30.1, 0.7044, 0.2790, -0.2038],
    winter2015: [11.1, 0.3284, 0.0094, 0.0771], winter2025: [15.1, 0.6602, 0.2887, -0.1906]
  },
  {
    objectId: 17, distance: 800, clc: "Permanent herbaceous", urbanAtlas: "Sports and leisure facilities",
    summer2015: [46.3, 0.1686, -0.0987, 0.1455], summer2025: [44.6, 0.4590, 0.0657, 0.0192],
    spring2015: [31.0, 0.1921, -0.0518, 0.1245], spring2025: [30.9, 0.6241, 0.2470, -0.1567],
    winter2015: [11.5, 0.2427, 0.0047, 0.0840], winter2025: [15.4, 0.6441, 0.2551, -0.1630]
  },
  {
    objectId: 18, distance: 850, clc: "Sealed", urbanAtlas: "Other roads and associated land",
    summer2015: [46.4, 0.2065, -0.0720, 0.1230], summer2025: [45.1, 0.4072, 0.1090, -0.0196],
    spring2015: [31.7, 0.3934, 0.1743, -0.0565], spring2025: [31.1, 0.4234, 0.1344, -0.0335],
    winter2015: [11.7, 0.2799, 0.0490, 0.0627], winter2025: [15.4, 0.4710, 0.1570, -0.0504]
  },
  {
    objectId: 19, distance: 900, clc: "Sealed", urbanAtlas: "Discontinuous dense urban fabric (S.L. : 50% - 80%)",
    summer2015: [46.9, 0.2159, -0.1001, 0.1465], summer2025: [45.8, 0.1947, -0.0878, 0.1492],
    spring2015: [33.0, 0.2013, -0.2124, 0.2381], spring2025: [31.8, 0.3513, 0.0922, -0.0064],
    winter2015: [12.1, 0.2533, -0.0013, 0.0962], winter2025: [15.5, 0.2972, 0.0134, 0.0832]
  },
  {
    objectId: 20, distance: 950, clc: "Sealed", urbanAtlas: "Discontinuous dense urban fabric (S.L. : 50% - 80%)",
    summer2015: [47.3, 0.2036, -0.1034, 0.1566], summer2025: [45.8, 0.1941, -0.0967, 0.1502],
    spring2015: [34.3, 0.1676, -0.1112, 0.1641], spring2025: [32.8, 0.1984, -0.1264, 0.1534],
    winter2015: [12.6, 0.1844, -0.0820, 0.1692], winter2025: [15.8, 0.2046, -0.0525, 0.1163]
  },
  {
    objectId: 21, distance: 1000, clc: "Non and sparselfy vegetated", urbanAtlas: "Discontinuous dense urban fabric (S.L. : 50% - 80%)",
    summer2015: [46.8, 0.1295, -0.1468, 0.1905], summer2025: [45.0, 0.1362, -0.0542, 0.1454],
    spring2015: [33.7, 0.1474, -0.0272, 0.0620], spring2025: [32.9, 0.1203, -0.0969, 0.1505],
    winter2015: [12.1, 0.1440, -0.2535, 0.2032], winter2025: [15.6, 0.0967, -0.1094, 0.1632]
  },
  {
    objectId: 22, distance: 1050, clc: "Sealed", urbanAtlas: "Discontinuous medium density urban fabric (S.L. : 30% - 50%)",
    summer2015: [46.8, 0.2782, -0.1097, 0.1448], summer2025: [45.2, 0.3251, 0.0413, 0.0660],
    spring2015: [33.7, 0.3533, -0.1052, 0.1698], spring2025: [32.3, 0.1804, -0.0064, 0.0817],
    winter2015: [11.6, 0.4175, -0.1217, 0.1157], winter2025: [14.9, 0.1748, 0.1557, -0.0298]
  },
  {
    objectId: 23, distance: 1100, clc: "Sealed", urbanAtlas: "Other roads and associated land",
    summer2015: [46.8, 0.1979, 0.0098, 0.0836], summer2025: [45.9, 0.1447, -0.0845, 0.1510],
    spring2015: [33.7, 0.1940, -0.0230, 0.1015], spring2025: [32.5, 0.2489, 0.0081, 0.0768],
    winter2015: [11.8, 0.2601, 0.0810, -0.0022], winter2025: [14.9, 0.3795, 0.0697, 0.0408]
  },
  {
    objectId: 24, distance: 1150, clc: "Sealed", urbanAtlas: "Discontinuous dense urban fabric (S.L. : 50% - 80%)",
    summer2015: [45.8, 0.3293, 0.0467, 0.0401], summer2025: [45.5, 0.3416, 0.0623, 0.0303],
    spring2015: [33.7, 0.3162, 0.0520, 0.0487], spring2025: [32.8, 0.3078, 0.0725, 0.0289],
    winter2015: [12.1, 0.3504, 0.0642, 0.0349], winter2025: [15.1, 0.3908, 0.1172, -0.0092]
  },
  {
    objectId: 25, distance: 1200, clc: "Sealed", urbanAtlas: "Discontinuous dense urban fabric (S.L. : 50% - 80%)",
    summer2015: [45.6, 0.3847, 0.1100, -0.0072], summer2025: [45.5, 0.2275, -0.0570, 0.1233],
    spring2015: [33.3, 0.2464, 0.0366, 0.0572], spring2025: [32.6, 0.2922, 0.0517, 0.0305],
    winter2015: [12.2, 0.2748, 0.0289, 0.0661], winter2025: [15.3, 0.2952, 0.0738, 0.0193]
  },
  {
    objectId: 26, distance: 1250, clc: "Permanent herbaceous", urbanAtlas: "Other roads and associated land",
    summer2015: [46.1, 0.3032, 0.0408, 0.0493], summer2025: [46.0, 0.2330, -0.0382, 0.1106],
    spring2015: [33.8, 0.2942, 0.0163, 0.0426], spring2025: [33.0, 0.2665, 0.0254, 0.0544],
    winter2015: [12.6, 0.3299, 0.0625, 0.0372], winter2025: [15.8, 0.3094, 0.0612, 0.0470]
  },
  {
    objectId: 27, distance: 1300, clc: "Sealed", urbanAtlas: "Other roads and associated land",
    summer2015: [46.0, 0.4180, 0.0828, -0.0025], summer2025: [45.5, 0.3346, -0.0441, 0.1190],
    spring2015: [33.1, 0.4878, 0.1914, -0.0782], spring2025: [32.3, 0.5290, 0.2086, -0.1024],
    winter2015: [12.2, 0.4654, 0.1975, -0.0775], winter2025: [15.4, 0.5710, 0.2739, -0.1598]
  },
  {
    objectId: 28, distance: 1350, clc: "Sealed", urbanAtlas: "Discontinuous dense urban fabric (S.L. : 50% - 80%)",
    summer2015: [46.1, 0.1703, -0.0945, 0.1574], summer2025: [45.3, 0.1428, -0.1350, 0.2012],
    spring2015: [32.6, 0.1643, -0.1745, 0.1750], spring2025: [32.4, 0.1423, -0.1057, 0.1664],
    winter2015: [11.5, 0.2379, -0.0115, 0.0793], winter2025: [14.8, 0.1971, -0.0974, 0.1826]
  },
  {
    objectId: 29, distance: 1400, clc: "Sealed", urbanAtlas: "Continuous urban fabric (S.L. : > 80%)",
    summer2015: [46.6, 0.2211, -0.0618, 0.1152], summer2025: [45.4, 0.2251, -0.0829, 0.1363],
    spring2015: [32.9, 0.1864, -0.1024, 0.1741], spring2025: [32.6, 0.1755, -0.0988, 0.1490],
    winter2015: [11.7, 0.2132, -0.0652, 0.1585], winter2025: [14.8, 0.2896, -0.0316, 0.1060]
  },
  {
    objectId: 30, distance: 1450, clc: "Sealed", urbanAtlas: "Other roads and associated land",
    summer2015: [46.8, 0.1830, -0.1145, 0.1502], summer2025: [45.4, 0.1372, -0.1362, 0.1708],
    spring2015: [33.0, 0.1489, -0.1378, 0.1690], spring2025: [32.3, 0.1322, -0.0906, 0.1368],
    winter2015: [11.8, 0.2156, -0.0792, 0.1557], winter2025: [14.9, 0.2001, -0.0795, 0.1761]
  },
  {
    objectId: 31, distance: 1500, clc: "Sealed", urbanAtlas: "Discontinuous dense urban fabric (S.L. : 50% - 80%)",
    summer2015: [46.6, 0.2270, -0.0873, 0.1362], summer2025: [45.4, 0.2212, -0.0869, 0.1374],
    spring2015: [32.2, 0.2558, -0.0165, 0.0859], spring2025: [31.6, 0.2593, -0.1089, 0.1353],
    winter2015: [11.8, 0.4492, 0.1010, -0.0188], winter2025: [14.9, 0.3347, 0.0077, 0.0686]
  },
  {
    objectId: 32, distance: 1550, clc: "Permanent herbaceous", urbanAtlas: "Herbaceous vegetation associations (natural grassland, moors...)",
    summer2015: [46.5, 0.3425, -0.0267, 0.0841], summer2025: [45.7, 0.3681, 0.0623, 0.0192],
    spring2015: [31.6, 0.4379, 0.1796, -0.0864], spring2025: [31.2, 0.3840, 0.0710, 0.0211],
    winter2015: [11.9, 0.5983, 0.1589, -0.0918], winter2025: [15.0, 0.6531, 0.3360, -0.2298]
  },
  {
    objectId: 33, distance: 1600, clc: "Permanent herbaceous", urbanAtlas: "Herbaceous vegetation associations (natural grassland, moors...)",
    summer2015: [46.7, 0.3475, -0.0744, 0.1282], summer2025: [46.1, 0.3196, -0.1271, 0.1643],
    spring2015: [30.6, 0.7140, 0.2832, -0.2089], spring2025: [30.1, 0.6878, 0.2963, -0.2006],
    winter2015: [12.4, 0.6160, 0.2496, -0.1498], winter2025: [15.3, 0.7499, 0.3068, -0.2328]
  },
  {
    objectId: 34, distance: 1650, clc: "Woody broadleaved evergreen trees", urbanAtlas: "Discontinuous medium density urban fabric (S.L. : 30% - 50%)",
    summer2015: [46.8, 0.3628, -0.0439, 0.0963], summer2025: [46.1, 0.3393, -0.0861, 0.1282],
    spring2015: [30.4, 0.6253, 0.2273, -0.1320], spring2025: [29.7, 0.7280, 0.3005, -0.2149],
    winter2015: [12.4, 0.5823, 0.2373, -0.1268], winter2025: [15.2, 0.7256, 0.2646, -0.1938]
  },
  {
    objectId: 35, distance: 1700, clc: "Woody broadleaved evergreen trees", urbanAtlas: "Discontinuous medium density urban fabric (S.L. : 30% - 50%)",
    summer2015: [46.8, 0.4369, 0.0404, 0.0224], summer2025: [46.0, 0.4779, 0.1069, -0.0434],
    spring2015: [30.5, 0.4947, 0.1874, -0.0973], spring2025: [29.8, 0.5638, 0.1621, -0.0613],
    winter2015: [12.4, 0.5770, 0.2284, -0.0973], winter2025: [15.1, 0.7678, 0.3907, -0.3098]
  },
  {
    objectId: 36, distance: 1750, clc: "Woody broadleaved evergreen trees", urbanAtlas: "Other roads and associated land",
    summer2015: [47.2, 0.4146, 0.0403, 0.0388], summer2025: [46.3, 0.4266, 0.0472, 0.0353],
    spring2015: [31.1, 0.6155, 0.1887, -0.1150], spring2025: [30.3, 0.5449, 0.1902, -0.0859],
    winter2015: [12.7, 0.4924, 0.0885, -0.0036], winter2025: [15.4, 0.6723, 0.3102, -0.2124]
  },
  {
    objectId: 37, distance: 1800, clc: "Permanent herbaceous", urbanAtlas: "Pastures",
    summer2015: [47.3, 0.3559, 0.0348, 0.0471], summer2025: [46.0, 0.3178, -0.0134, 0.0881],
    spring2015: [31.2, 0.4164, 0.0639, 0.0159], spring2025: [30.5, 0.3989, 0.0954, -0.0055],
    winter2015: [12.5, 0.4381, 0.1352, -0.0478], winter2025: [15.3, 0.5222, 0.1701, -0.0758]
  },
  {
    objectId: 38, distance: 1850, clc: "Sealed", urbanAtlas: "Discontinuous medium density urban fabric (S.L. : 30% - 50%)",
    summer2015: [47.7, 0.3089, -0.0067, 0.0757], summer2025: [46.5, 0.3380, 0.0122, 0.0681],
    spring2015: [30.6, 0.4041, 0.1041, -0.0170], spring2025: [30.6, 0.3057, -0.0051, 0.0579],
    winter2015: [12.7, 0.3295, 0.0739, 0.0304], winter2025: [15.2, 0.2736, 0.0303, 0.0681]
  },
  {
    objectId: 39, distance: 1900, clc: "Permanent herbaceous", urbanAtlas: "Pastures",
    summer2015: [48.8, 0.3735, -0.0946, 0.1351], summer2025: [48.5, 0.3508, -0.0823, 0.1417],
    spring2015: [30.4, 0.6723, 0.2133, -0.1366], spring2025: [30.3, 0.6112, 0.1512, -0.0734],
    winter2015: [13.5, 0.6319, 0.1947, -0.1041], winter2025: [15.6, 0.8301, 0.4395, -0.3746]
  },
  {
    objectId: 40, distance: 1950, clc: "Woody broadleaved evergreen trees", urbanAtlas: "Pastures",
    summer2015: [49.1, 0.3155, -0.1154, 0.1553], summer2025: [48.7, 0.3091, -0.0848, 0.1421],
    spring2015: [30.3, 0.5268, 0.0611, 0.0145], spring2025: [29.8, 0.5440, 0.1185, -0.0359],
    winter2015: [13.3, 0.6192, 0.1938, -0.1062], winter2025: [15.5, 0.7716, 0.4608, -0.3654]
  },
  {
    objectId: 41, distance: 2000, clc: "Permanent herbaceous", urbanAtlas: "Pastures",
    summer2015: [49.4, 0.2809, -0.1222, 0.1627], summer2025: [48.8, 0.2581, -0.1068, 0.1584],
    spring2015: [31.0, 0.6167, 0.1761, -0.0901], spring2025: [29.6, 0.6309, 0.2466, -0.1475],
    winter2015: [13.2, 0.5500, 0.1264, -0.0357], winter2025: [15.7, 0.8462, 0.5133, -0.4426]
  },
  {
    objectId: 42, distance: 2050, clc: "Permanent herbaceous", urbanAtlas: "Pastures",
    summer2015: [50.0, 0.3081, -0.1322, 0.1639], summer2025: [48.2, 0.3217, -0.1079, 0.1477],
    spring2015: [31.4, 0.6779, 0.2521, -0.1720], spring2025: [29.6, 0.6512, 0.2385, -0.1506],
    winter2015: [13.5, 0.6114, 0.1295, -0.0553], winter2025: [16.0, 0.7784, 0.3754, -0.2980]
  },
  {
    objectId: 43, distance: 2100, clc: "Permanent herbaceous", urbanAtlas: "Herbaceous vegetation associations (natural grassland, moors...)",
    summer2015: [50.1, 0.3162, -0.1410, 0.1662], summer2025: [47.7, 0.3107, -0.1374, 0.1766],
    spring2015: [31.5, 0.7059, 0.2587, -0.1857], spring2025: [29.8, 0.6816, 0.2587, -0.1730],
    winter2015: [13.3, 0.6138, 0.1410, -0.0654], winter2025: [15.9, 0.7814, 0.3900, -0.3120]
  },
  {
    objectId: 44, distance: 2150, clc: "Woody broadleaved evergreen trees", urbanAtlas: "Herbaceous vegetation associations (natural grassland, moors...)",
    summer2015: [50.1, 0.4243, -0.0133, 0.0622], summer2025: [47.2, 0.4027, 0.0240, 0.0473],
    spring2015: [31.5, 0.5214, 0.1030, -0.0231], spring2025: [31.4, 0.4497, 0.0545, 0.0226],
    winter2015: [13.5, 0.5666, 0.1110, -0.0439], winter2025: [16.1, 0.5254, 0.1405, -0.0632]
  },
  {
    objectId: 45, distance: 2200, clc: "Woody broadleaved evergreen trees", urbanAtlas: "Herbaceous vegetation associations (natural grassland, moors...)",
    summer2015: [50.8, 0.2719, -0.1361, 0.1705], summer2025: [47.4, 0.3735, -0.0227, 0.0950],
    spring2015: [31.3, 0.7213, 0.3301, -0.2480], spring2025: [32.2, 0.3524, -0.0636, 0.1316],
    winter2015: [13.7, 0.6098, 0.1194, -0.0628], winter2025: [16.2, 0.5313, 0.0916, -0.0114]
  },
  {
    objectId: 46, distance: 2250, clc: "Permanent herbaceous", urbanAtlas: "Herbaceous vegetation associations (natural grassland, moors...)",
    summer2015: [51.5, 0.2334, -0.1653, 0.1834], summer2025: [46.7, 0.3028, -0.1612, 0.1919],
    spring2015: [30.6, 0.7636, 0.3836, -0.3012], spring2025: [31.4, 0.6731, 0.2904, -0.1984],
    winter2015: [13.6, 0.7012, 0.2122, -0.1572], winter2025: [16.1, 0.6558, 0.1911, -0.1178]
  },
  {
    objectId: 47, distance: 2300, clc: "Permanent herbaceous", urbanAtlas: "Herbaceous vegetation associations (natural grassland, moors...)",
    summer2015: [50.5, 0.3196, -0.0766, 0.1273], summer2025: [46.5, 0.3188, -0.0993, 0.1510],
    spring2015: [30.7, 0.7404, 0.3953, -0.3122], spring2025: [30.6, 0.7646, 0.4305, -0.3379],
    winter2015: [13.2, 0.7130, 0.2878, -0.2151], winter2025: [16.2, 0.7353, 0.2556, -0.1857]
  },
  {
    objectId: 48, distance: 2350, clc: "Sealed", urbanAtlas: "Discontinuous low density urban fabric (S.L. : 10% - 30%)",
    summer2015: [48.8, 0.3583, -0.0005, 0.0668], summer2025: [46.2, 0.3568, -0.0092, 0.0827],
    spring2015: [30.8, 0.5058, 0.1720, -0.0673], spring2025: [30.0, 0.5705, 0.1977, -0.1020],
    winter2015: [12.7, 0.4696, 0.1559, -0.0491], winter2025: [15.8, 0.6288, 0.2655, -0.1688]
  },
  {
    objectId: 49, distance: 2400, clc: "Low-growing woody plants", urbanAtlas: "Discontinuous very low density urban fabric (S.L. : < 10%)",
    summer2015: [46.6, 0.3697, 0.0008, 0.0809], summer2025: [45.2, 0.3721, -0.0594, 0.1120],
    spring2015: [30.1, 0.6320, 0.2189, -0.1599], spring2025: [29.2, 0.6697, 0.3138, -0.2135],
    winter2015: [11.7, 0.6632, 0.2425, -0.1665], winter2025: [14.8, 0.7631, 0.3619, -0.2794]
  },
  {
    objectId: 50, distance: 2450, clc: "Permanent herbaceous", urbanAtlas: "Discontinuous low density urban fabric (S.L. : 10% - 30%)",
    summer2015: [46.9, 0.3409, -0.0700, 0.1162], summer2025: [45.3, 0.3765, -0.0328, 0.0934],
    spring2015: [30.6, 0.6335, 0.1206, -0.0670], spring2025: [29.4, 0.6046, 0.1912, -0.1108],
    winter2015: [11.9, 0.5576, 0.1149, -0.0342], winter2025: [15.2, 0.6305, 0.2056, -0.1124]
  },
  {
    objectId: 51, distance: 2500, clc: "Permanent herbaceous", urbanAtlas: "Discontinuous low density urban fabric (S.L. : 10% - 30%)",
    summer2015: [47.4, 0.4020, -0.0244, 0.0825], summer2025: [45.4, 0.3569, -0.0825, 0.1382],
    spring2015: [30.7, 0.6071, 0.1579, -0.0852], spring2025: [29.7, 0.6224, 0.2136, -0.1267],
    winter2015: [12.1, 0.5600, 0.1293, -0.0553], winter2025: [15.3, 0.6378, 0.1356, -0.0732]
  },
  {
    objectId: 52, distance: 2550, clc: "Sealed", urbanAtlas: "Other roads and associated land",
    summer2015: [48.2, 0.2482, -0.0822, 0.1349], summer2025: [46.2, 0.3327, -0.0367, 0.1019],
    spring2015: [30.7, 0.6196, 0.2201, -0.1433], spring2025: [29.6, 0.5112, 0.1397, -0.0611],
    winter2015: [12.6, 0.6067, 0.2099, -0.1287], winter2025: [15.4, 0.5957, 0.1630, -0.0811]
  },
  {
    objectId: 53, distance: 2600, clc: "Permanent herbaceous", urbanAtlas: "Pastures",
    summer2015: [49.7, 0.2711, -0.1338, 0.1717], summer2025: [47.6, 0.3182, -0.1258, 0.1695],
    spring2015: [32.1, 0.7051, 0.2570, -0.1744], spring2025: [30.5, 0.6538, 0.2041, -0.1251],
    winter2015: [13.7, 0.6164, 0.1827, -0.0945], winter2025: [16.5, 0.6106, 0.0957, -0.0351]
  },
  {
    objectId: 54, distance: 2650, clc: "Permanent herbaceous", urbanAtlas: "Pastures",
    summer2015: [50.0, 0.2805, -0.1247, 0.1680], summer2025: [48.5, 0.3028, -0.1332, 0.1763],
    spring2015: [33.8, 0.6448, 0.1954, -0.1137], spring2025: [30.5, 0.6348, 0.2270, -0.1400],
    winter2015: [13.8, 0.6136, 0.1597, -0.0855], winter2025: [16.6, 0.6054, 0.1196, -0.0463]
  },
  {
    objectId: 55, distance: 2700, clc: "Permanent herbaceous", urbanAtlas: "Pastures",
    summer2015: [49.3, 0.2569, -0.1370, 0.1792], summer2025: [48.2, 0.2461, -0.1503, 0.1902],
    spring2015: [32.6, 0.3046, -0.1919, 0.2274], spring2025: [30.4, 0.6389, 0.1933, -0.1203],
    winter2015: [13.1, 0.5576, 0.1159, -0.0398], winter2025: [15.7, 0.6942, 0.3545, -0.2500]
  },
  {
    objectId: 56, distance: 2750, clc: "Permanent herbaceous", urbanAtlas: "Pastures",
    summer2015: [49.4, 0.2404, -0.1256, 0.1700], summer2025: [48.5, 0.2975, -0.1413, 0.1718],
    spring2015: [32.1, 0.5520, 0.0806, -0.0074], spring2025: [29.2, 0.6387, 0.2122, -0.1299],
    winter2015: [13.4, 0.5496, 0.0967, -0.0310], winter2025: [15.8, 0.6830, 0.3009, -0.2076]
  },
  {
    objectId: 57, distance: 2800, clc: "Permanent herbaceous", urbanAtlas: "Arable land (annual crops)",
    summer2015: [48.8, 0.2141, -0.0961, 0.1616], summer2025: [48.1, 0.2998, -0.1682, 0.1959],
    spring2015: [30.5, 0.6030, 0.1231, -0.0451], spring2025: [28.6, 0.7200, 0.3530, -0.2652],
    winter2015: [13.6, 0.5592, 0.0964, -0.0403], winter2025: [16.0, 0.7284, 0.2681, -0.1974]
  },
  {
    objectId: 58, distance: 2850, clc: "Permanent herbaceous", urbanAtlas: "Arable land (annual crops)",
    summer2015: [48.4, 0.2234, -0.0953, 0.1616], summer2025: [47.1, 0.3009, -0.1607, 0.1939],
    spring2015: [29.5, 0.6581, 0.2067, -0.1255], spring2025: [27.9, 0.7370, 0.4004, -0.3072],
    winter2015: [13.5, 0.5530, 0.0843, -0.0266], winter2025: [16.1, 0.7334, 0.2789, -0.2097]
  },
  {
    objectId: 59, distance: 2900, clc: "Permanent herbaceous", urbanAtlas: "Arable land (annual crops)",
    summer2015: [48.1, 0.2436, -0.1246, 0.1738], summer2025: [46.5, 0.3041, -0.1569, 0.1909],
    spring2015: [29.6, 0.7029, 0.2844, -0.2015], spring2025: [28.1, 0.7583, 0.4139, -0.3237],
    winter2015: [13.4, 0.5789, 0.1158, -0.0495], winter2025: [16.1, 0.6935, 0.2284, -0.1569]
  },
  {
    objectId: 60, distance: 2950, clc: "Permanent herbaceous", urbanAtlas: "Herbaceous vegetation associations (natural grassland, moors...)",
    summer2015: [47.8, 0.3140, -0.1091, 0.1528], summer2025: [45.6, 0.3054, -0.1371, 0.1748],
    spring2015: [29.1, 0.7236, 0.3084, -0.2273], spring2025: [28.5, 0.6607, 0.2891, -0.1951],
    winter2015: [13.1, 0.5884, 0.1606, -0.0738], winter2025: [15.8, 0.6894, 0.2378, -0.1621]
  },
  {
    objectId: 61, distance: 3000, clc: "Permanent herbaceous", urbanAtlas: "Herbaceous vegetation associations (natural grassland, moors...)",
    summer2015: [47.8, 0.3194, -0.1203, 0.1590], summer2025: [45.2, 0.3567, -0.1194, 0.1532],
    spring2015: [29.2, 0.7132, 0.2821, -0.2043], spring2025: [28.5, 0.5024, 0.0858, -0.0039],
    winter2015: [13.2, 0.6779, 0.2281, -0.1542], winter2025: [15.7, 0.7626, 0.4102, -0.3177]
  },
  {
    objectId: 62, distance: 3050, clc: "Permanent herbaceous", urbanAtlas: "Herbaceous vegetation associations (natural grassland, moors...)",
    summer2015: [47.4, 0.3098, -0.1321, 0.1667], summer2025: [44.9, 0.3546, -0.1298, 0.1641],
    spring2015: [29.1, 0.7281, 0.2749, -0.2022], spring2025: [28.7, 0.6307, 0.2246, -0.1350],
    winter2015: [13.2, 0.6355, 0.1670, -0.0940], winter2025: [15.6, 0.7242, 0.2886, -0.2043]
  },
  {
    objectId: 63, distance: 3100, clc: "Permanent herbaceous", urbanAtlas: "Discontinuous very low density urban fabric (S.L. : < 10%)",
    summer2015: [47.1, 0.3854, -0.0800, 0.1200], summer2025: [45.0, 0.3847, -0.0643, 0.1182],
    spring2015: [30.0, 0.5706, 0.1307, -0.0495], spring2025: [28.5, 0.6889, 0.2919, -0.2048],
    winter2015: [13.0, 0.6310, 0.1952, -0.1199], winter2025: [15.3, 0.6671, 0.2476, -0.1574]
  },
  {
    objectId: 64, distance: 3150, clc: "Permanent herbaceous", urbanAtlas: "Discontinuous very low density urban fabric (S.L. : < 10%)",
    summer2015: [46.9, 0.4534, 0.0053, 0.0561], summer2025: [45.1, 0.3551, -0.0149, 0.0775],
    spring2015: [30.3, 0.6314, 0.1752, -0.1051], spring2025: [28.6, 0.4582, 0.0425, 0.0332],
    winter2015: [12.8, 0.6119, 0.1405, -0.0761], winter2025: [15.2, 0.4920, 0.1228, -0.0495]
  },
  {
    objectId: 65, distance: 3200, clc: "Permanent herbaceous", urbanAtlas: "Discontinuous very low density urban fabric (S.L. : < 10%)",
    summer2015: [46.5, 0.3602, -0.0412, 0.0921], summer2025: [44.2, 0.3988, 0.0593, 0.0202],
    spring2015: [31.6, 0.3826, 0.0463, 0.0291], spring2025: [29.3, 0.4320, 0.0893, 0.0060],
    winter2015: [12.5, 0.6007, 0.2198, -0.1259], winter2025: [15.2, 0.6462, 0.2920, -0.1912]
  },
  {
    objectId: 66, distance: 3250, clc: "Woody broadleaved evergreen trees", urbanAtlas: "Discontinuous very low density urban fabric (S.L. : < 10%)",
    summer2015: [45.5, 0.4031, -0.0241, 0.0732], summer2025: [43.2, 0.4984, 0.0888, -0.0270],
    spring2015: [32.2, 0.3895, -0.0548, 0.1262], spring2025: [29.3, 0.5153, 0.0903, -0.0287],
    winter2015: [12.5, 0.4317, 0.0204, 0.0701], winter2025: [15.1, 0.5703, 0.1663, -0.0759]
  },
  {
    objectId: 67, distance: 3300, clc: "Woody broadleaved evergreen trees", urbanAtlas: "Discontinuous very low density urban fabric (S.L. : < 10%)",
    summer2015: [44.9, 0.2424, -0.1024, 0.1638], summer2025: [43.3, 0.3454, -0.0621, 0.1243],
    spring2015: [31.5, 0.4237, -0.0506, 0.0800], spring2025: [28.9, 0.4166, 0.0605, 0.0150],
    winter2015: [12.5, 0.4726, 0.1007, -0.0138], winter2025: [15.0, 0.5659, 0.1003, -0.0177]
  },
  {
    objectId: 68, distance: 3350, clc: "Woody broadleaved evergreen trees", urbanAtlas: "Herbaceous vegetation associations (natural grassland, moors...)",
    summer2015: [44.8, 0.5293, 0.1539, -0.0464], summer2025: [43.8, 0.3850, 0.0068, 0.0835],
    spring2015: [30.3, 0.7514, 0.3314, -0.2619], spring2025: [29.3, 0.4884, 0.1053, -0.0145],
    winter2015: [12.6, 0.7088, 0.3402, -0.2446], winter2025: [15.4, 0.7609, 0.4456, -0.3462]
  },
  {
    objectId: 69, distance: 3400, clc: "Woody needle leaved trees", urbanAtlas: "Forests",
    summer2015: [45.3, 0.5303, 0.1157, -0.0305], summer2025: [44.0, 0.5120, 0.1040, -0.0224],
    spring2015: [29.8, 0.6875, 0.2836, -0.2029], spring2025: [28.8, 0.6371, 0.1833, -0.1070],
    winter2015: [12.6, 0.7272, 0.2936, -0.2268], winter2025: [15.2, 0.7854, 0.3958, -0.3259]
  },
  {
    objectId: 70, distance: 3450, clc: "Permanent herbaceous", urbanAtlas: "Forests",
    summer2015: [46.1, 0.4754, 0.0601, 0.0164], summer2025: [44.1, 0.5093, 0.0834, -0.0059],
    spring2015: [29.6, 0.7035, 0.2549, -0.1863], spring2025: [28.4, 0.6278, 0.1797, -0.1100],
    winter2015: [12.6, 0.7290, 0.3062, -0.2270], winter2025: [15.2, 0.7497, 0.3309, -0.2553]
  },
  {
    objectId: 71, distance: 3500, clc: "Permanent herbaceous", urbanAtlas: "Pastures",
    summer2015: [48.2, 0.3215, -0.0798, 0.1313], summer2025: [44.5, 0.3837, -0.0725, 0.1226],
    spring2015: [29.2, 0.6971, 0.2962, -0.2123], spring2025: [27.9, 0.6556, 0.2333, -0.1507],
    winter2015: [12.4, 0.7225, 0.2907, -0.2156], winter2025: [15.3, 0.6899, 0.2577, -0.1795]
  },
  {
    objectId: 72, distance: 3550, clc: "Permanent herbaceous", urbanAtlas: "Pastures",
    summer2015: [49.5, 0.2578, -0.1540, 0.1832], summer2025: [45.3, 0.3156, -0.1338, 0.1736],
    spring2015: [29.1, 0.7196, 0.2797, -0.2038], spring2025: [27.8, 0.6927, 0.2937, -0.2075],
    winter2015: [12.4, 0.6998, 0.2344, -0.1612], winter2025: [15.4, 0.6828, 0.2488, -0.1679]
  },
  {
    objectId: 73, distance: 3600, clc: "Permanent herbaceous", urbanAtlas: "Pastures",
    summer2015: [51.9, 0.2486, -0.1893, 0.1947], summer2025: [46.6, 0.3094, -0.1386, 0.1772],
    spring2015: [29.4, 0.7212, 0.2807, -0.2031], spring2025: [28.2, 0.7150, 0.3245, -0.2385],
    winter2015: [12.7, 0.6677, 0.2073, -0.1308], winter2025: [15.6, 0.7736, 0.3637, -0.2890]
  },
  {
    objectId: 74, distance: 3650, clc: "Permanent herbaceous", urbanAtlas: "Pastures",
    summer2015: [52.7, 0.2684, -0.1256, 0.1568], summer2025: [47.5, 0.3279, -0.1092, 0.1548],
    spring2015: [31.0, 0.6597, 0.2029, -0.1311], spring2025: [29.5, 0.6809, 0.3085, -0.2150],
    winter2015: [13.8, 0.6128, 0.1475, -0.0745], winter2025: [16.9, 0.7056, 0.2596, -0.1831]
  },
  {
    objectId: 75, distance: 3700, clc: "Permanent herbaceous", urbanAtlas: "Pastures",
    summer2015: [52.8, 0.2391, -0.1755, 0.1918], summer2025: [47.5, 0.3088, -0.1253, 0.1696],
    spring2015: [31.0, 0.6576, 0.2291, -0.1492], spring2025: [29.5, 0.6794, 0.2918, -0.2011],
    winter2015: [13.8, 0.6495, 0.1804, -0.1047], winter2025: [16.9, 0.6965, 0.2441, -0.1695]
  },
  {
    objectId: 76, distance: 3750, clc: "Permanent herbaceous", urbanAtlas: "Pastures",
    summer2015: [51.0, 0.2634, -0.1714, 0.1813], summer2025: [46.2, 0.3492, -0.1205, 0.1607],
    spring2015: [29.5, 0.6771, 0.2192, -0.1455], spring2025: [28.1, 0.6891, 0.3264, -0.2297],
    winter2015: [12.8, 0.6551, 0.1817, -0.1040], winter2025: [15.9, 0.6877, 0.1918, -0.1244]
  },
  {
    objectId: 77, distance: 3800, clc: "Permanent herbaceous", urbanAtlas: "Pastures",
    summer2015: [49.6, 0.3513, -0.0946, 0.1243], summer2025: [46.7, 0.3647, -0.0592, 0.1119],
    spring2015: [29.1, 0.6082, 0.1504, -0.0748], spring2025: [28.4, 0.6078, 0.2206, -0.1264],
    winter2015: [13.0, 0.5345, 0.1061, -0.0349], winter2025: [16.2, 0.5482, 0.1343, -0.0608]
  },
  {
    objectId: 78, distance: 3850, clc: "Sealed", urbanAtlas: "Fast transit roads and associated land",
    summer2015: [49.6, 0.2151, -0.1149, 0.1490], summer2025: [47.1, 0.2365, -0.0854, 0.1354],
    spring2015: [29.2, 0.3957, 0.0176, 0.0522], spring2025: [28.6, 0.3912, 0.0727, 0.0041],
    winter2015: [13.4, 0.3673, 0.0023, 0.0711], winter2025: [16.5, 0.3143, 0.0604, 0.0515]
  },
  {
    objectId: 79, distance: 3900, clc: "Periodically herbaceous", urbanAtlas: "Arable land (annual crops)",
    summer2015: [49.9, 0.2264, -0.1546, 0.2010], summer2025: [47.1, 0.2933, -0.1501, 0.1899],
    spring2015: [28.8, 0.8346, 0.4650, -0.3979], spring2025: [28.0, 0.7100, 0.3866, -0.2718],
    winter2015: [13.5, 0.6713, 0.2403, -0.1544], winter2025: [16.7, 0.4607, -0.0080, 0.0743]
  },
  {
    objectId: 80, distance: 3950, clc: "Permanent herbaceous", urbanAtlas: "Arable land (annual crops)",
    summer2015: [50.4, 0.2507, -0.1451, 0.1860], summer2025: [47.5, 0.3156, -0.1393, 0.1772],
    spring2015: [28.8, 0.7549, 0.3670, -0.2860], spring2025: [27.5, 0.6336, 0.3219, -0.1990],
    winter2015: [13.8, 0.6598, 0.2188, -0.1369], winter2025: [16.9, 0.5509, 0.0453, 0.0098]
  },
  {
    objectId: 81, distance: 4000, clc: "Woody broadleaved evergreen trees", urbanAtlas: "Herbaceous vegetation associations (natural grassland, moors...)",
    summer2015: [50.4, 0.3342, -0.0890, 0.1360], summer2025: [47.5, 0.3635, -0.1049, 0.1507],
    spring2015: [28.8, 0.7404, 0.3209, -0.2473], spring2025: [27.4, 0.6596, 0.3322, -0.2171],
    winter2015: [13.9, 0.6706, 0.2267, -0.1504], winter2025: [16.9, 0.6456, 0.1304, -0.0654]
  },
  {
    objectId: 82, distance: 4050, clc: "Woody broadleaved evergreen trees", urbanAtlas: "Herbaceous vegetation associations (natural grassland, moors...)",
    summer2015: [50.4, 0.3342, -0.0890, 0.1360], summer2025: [47.5, 0.3635, -0.1049, 0.1507],
    spring2015: [28.8, 0.7404, 0.3209, -0.2473], spring2025: [27.4, 0.6596, 0.3322, -0.2171],
    winter2015: [13.9, 0.6706, 0.2267, -0.1504], winter2025: [16.9, 0.6456, 0.1304, -0.0654]
  }
];
