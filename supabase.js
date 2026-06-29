const SUPABASE_URL = "https://yphzwcwhnugpxgpkxawc.supabase.co/rest/v1/";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwaHp3Y3dobnVncHhncGt4YXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzUxMDUsImV4cCI6MjA5ODMxMTEwNX0.GXGs43O0w5YmiOKv7Es1OErheJCKdOTzXv_m-cKTQUA";

const supabaseClient =window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.supabaseClient = supabaseClient;

console.log("supa carregado");