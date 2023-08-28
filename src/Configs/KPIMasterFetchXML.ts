const KPI_FETCH_XML = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">'+
'<entity name="cb_kpimasterdata">'+
 '<attribute name="cb_kpimasterdataid" />'+
  '<attribute name="cb_name" />'+
  '<attribute name="cb_fetchxml" />'+
  '<attribute name="cb_columnlayout" />'+
  '<order attribute="cb_name" descending="false" />'+
  '<filter type="and">'+
    '<condition attribute="cb_kpimasterdataid" operator="eq" value="2ED4C990-9C42-EE11-BDF4-0022482A939E" />'+
  '</filter>'
'</entity>'+
'</fetch>';
