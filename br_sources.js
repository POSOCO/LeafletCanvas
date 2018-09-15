// lat,lng,mvar,pntId,base_volt,desc,status,voltage_id,source_iter
var br_sources_g = [[null, null, 0, 'WRLDCMP.SCADA1.A0037380', 400, 'Aurangabad', null, 'WRLDCMP.SCADA1.A0037317', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0000121', 400, 'Bachau', null, 'WRLDCMP.SCADA1.A0000077', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0000126', 400, 'Bachau', null, 'WRLDCMP.SCADA1.A0000077', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0000326', 400, 'Bhadrawati', null, 'WRLDCMP.SCADA1.A0000279', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0000471', 400, 'Bhatapara', null, 'WRLDCMP.SCADA1.A0000449', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0000701', 400, 'Bina', null, 'WRLDCMP.SCADA1.A0000653', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0001065', 400, 'Damoh', null, 'WRLDCMP.SCADA1.A0001028', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0001067', 400, 'Damoh', null, 'WRLDCMP.SCADA1.A0001028', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0001204', 400, 'Dehgam', null, 'WRLDCMP.SCADA1.A0001234', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0001206', 400, 'Dehgam', null, 'WRLDCMP.SCADA1.A0001234', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0001522', 400, 'Gwalior', null, 'WRLDCMP.SCADA1.A0001475', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0001523', 400, 'Gwalior', null, 'WRLDCMP.SCADA1.A0001475', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0001524', 400, 'Gwalior', null, 'WRLDCMP.SCADA1.A0001475', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A00001678', 400, 'Indore', null, 'WRLDCMP.SCADA1.A0001647', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A00001680', 400, 'Indore', null, 'WRLDCMP.SCADA1.A0001647', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A00001768', 400, 'Itarsi', null, 'WRLDCMP.SCADA1.A0001822', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A00001773', 400, 'Itarsi', null, 'WRLDCMP.SCADA1.A0001822', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A00001779', 400, 'Itarsi', null, 'WRLDCMP.SCADA1.A0001822', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A00001866', 400, 'Jabalpur', null, 'WRLDCMP.SCADA1.A0001915', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A00001871', 400, 'Jabalpur', null, 'WRLDCMP.SCADA1.A0001915', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0037718', 400, 'Jabalpur Pooling', null, 'WRLDCMP.SCADA1.A0037668', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0037719', 400, 'Jabalpur Pooling', null, 'WRLDCMP.SCADA1.A0037668', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0045105', 400, 'Kala', null, 'WRLDCMP.SCADA1.A0038352', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0002453', 400, 'Khandwa', null, 'WRLDCMP.SCADA1.A0002414', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0002455', 400, 'Khandwa', null, 'WRLDCMP.SCADA1.A0002414', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0046585', 400, 'Kolhapur', null, 'WRLDCMP.SCADA1.A0046560', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0037933', 400, 'Kotra', null, 'WRLDCMP.SCADA1.A0037878', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0002831', 400, 'Mapusa', null, 'WRLDCMP.SCADA1.A0002803', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0002991', 400, 'Navsari', null, 'WRLDCMP.SCADA1.A0002957', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0003122', 400, 'Pirana', null, 'WRLDCMP.SCADA1.A0003094', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0003198', 400, 'Pune', null, 'WRLDCMP.SCADA1.A0003148', null],
    [null, null, 0, 'WRLDCMP.SCADA3.A0104684', 400, 'Betul', null, 'WRLDCMP.SCADA3.A0104646', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0038785', 400, 'Daman', null, 'WRLDCMP.SCADA1.A0038757', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0003066', 400, 'Parli', null, 'WRLDCMP.SCADA1.A0003026', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0047579', 400, 'Parli', null, 'WRLDCMP.SCADA1.A0003026', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0005432', 400, 'Wardha', null, 'WRLDCMP.SCADA1.A0005331', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0003295', 400, 'Raigarh', null, 'WRLDCMP.SCADA1.A0003249', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0003296', 400, 'Raigarh', null, 'WRLDCMP.SCADA1.A0003249', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0003408', 400, 'Raipur', null, 'WRLDCMP.SCADA1.A0037542', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0003420', 400, 'Raipur', null, 'WRLDCMP.SCADA1.A0037542', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0003535', 400, 'Rajgarh', null, 'WRLDCMP.SCADA1.A0003501', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0003840', 400, 'Satna', null, 'WRLDCMP.SCADA1.A0003794', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0003851', 400, 'Satna', null, 'WRLDCMP.SCADA1.A0003794', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0004051', 400, 'Seoni', null, 'WRLDCMP.SCADA1.A0004003', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0004053', 400, 'Seoni', null, 'WRLDCMP.SCADA1.A0004003', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0004362', 400, 'Solapur', null, 'WRLDCMP.SCADA1.A0004312', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0004583', 400, 'Sujalpur', null, 'WRLDCMP.SCADA1.A0004553', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0047587', 400, 'Sujalpur', null, 'WRLDCMP.SCADA1.A0004553', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0043438', 400, 'Vindhyanchal Pooling', null, 'WRLDCMP.SCADA1.A0043409', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0048917', 400, 'Champa', null, 'WRLDCMP.SCADA1.A0045141', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0037389', 765, 'Aurangabad', null, 'WRLDCMP.SCADA1.A0036002', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0000577', 765, 'Akola', null, 'WRLDCMP.SCADA1.A0037325', null],
    [null, null, 0, '', 765, 'Bilaspur', null, 'WRLDCMP.SCADA1.A0037484', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0000777', 765, 'Bina', null, 'WRLDCMP.SCADA1.A0000833', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0037515', 765, 'Bhopal_BDTCL', null, 'WRLDCMP.SCADA1.A0000500', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0041484', 765, 'Champa', null, 'WRLDCMP.SCADA1.A0041476', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0038248', 765, 'Dharamjaygarh', null, 'WRLDCMP.SCADA1.A0038191', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0038250', 765, 'Dharamjaygarh', null, 'WRLDCMP.SCADA1.A0038191', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0038538', 765, 'Dhule_BDTCL', null, 'WRLDCMP.SCADA1.A0038508', null],
    [null, null, 0, 'WRLDCMP.SCADA3.A0100986', 765, 'Ektuni', null, 'WRLDCMP.SCADA3.A0100958', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0001526', 765, 'Gwalior', null, 'WRLDCMP.SCADA1.A0001653', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0001682', 765, 'Indore_PG', null, 'WRLDCMP.SCADA1.A0037672', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0001684', 765, 'Indore_PG', null, 'WRLDCMP.SCADA1.A0037672', null],
    [null, null, 0, '', 765, 'Jabalpoor_PS', null, 'WRLDCMP.SCADA1.A0045800', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0045828', 765, 'Koradi(3)', null, 'WRLDCMP.SCADA1.A0045800', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0037936', 765, 'Kotra', null, 'WRLDCMP.SCADA1.A0037886', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0043546', 765, 'Pune_GIS', null, 'WRLDCMP.SCADA1.A0003668', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0003705', 765, 'Sasan', null, 'WRLDCMP.SCADA1.A0004007', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0043860', 765, 'Satna', null, 'WRLDCMP.SCADA1.A0003911', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0003938', 765, 'Satna', null, 'WRLDCMP.SCADA1.A0003911', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0004055', 765, 'Seoni', null, 'WRLDCMP.SCADA1.A0004140', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0004207', 765, 'Sipat', null, 'WRLDCMP.SCADA1.A0004316', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0004368', 765, 'Solapur', null, 'WRLDCMP.SCADA1.A0038084', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0038107', 765, 'Tamnar', null, 'WRLDCMP.SCADA1.A0043469', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0035947', 765, 'Tiroda', null, 'WRLDCMP.SCADA1.A0035914', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0043493', 765, 'Vadodara', null, 'WRLDCMP.SCADA1.A0043413', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0045506', 765, 'Vindhyanchal_PS', null, 'WRLDCMP.SCADA1.A0005338', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0005439', 765, 'Wardha', null, 'WRLDCMP.SCADA1.A0037546', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0005448', 765, 'Wardha', null, 'WRLDCMP.SCADA1.A0037546', null],
    [null, null, 0, 'WRLDCMP.SCADA1.A0037581', 765, 'Durg', null, 'WRLDCMP.SCADA1.A0037546', null]
];