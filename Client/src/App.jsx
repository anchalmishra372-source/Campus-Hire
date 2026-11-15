
import {useEffect,useMemo,useState} from "react";
import {Link,NavLink,Route,Routes,Navigate,useNavigate} from "react-router-dom";
import {
 BriefcaseBusiness,Building2,ChartNoAxesCombined,ChevronRight,
 CircleUserRound,FileText,Heart,LayoutDashboard,LogOut,Bell,
 Search,ShieldCheck,Users,Plus,MapPin,Clock3,ArrowUpRight,
 CheckCircle2,Menu,X,Trash2,Pencil,UploadCloud,TrendingUp,
 Activity,Bookmark,GraduationCap,Download,Sparkles,ClipboardList
} from "lucide-react";
import {
 AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,
 ResponsiveContainer,BarChart,Bar,PieChart,Pie,Cell,Legend
} from "recharts";
import api from "./api";
import {useAuth} from "./context/AuthContext";

const moneyColors=["#5B7CFA","#21B8A6","#F5A623","#EF6B73"];

function AppShell({children,active="home"}){
 const {user,logout}=useAuth();
 const [open,setOpen]=useState(false);
 const [unread,setUnread]=useState(0);

 useEffect(()=>{
  if(user)api.get("/notifications")
   .then(r=>setUnread((r.data.notifications||[]).filter(n=>!n.read).length))
   .catch(()=>{});
 },[user]);

 const links=user?.role==="admin"?[
  ["/admin","Overview",LayoutDashboard],
  ["/admin/analytics","Analytics",ChartNoAxesCombined],
  ["/admin/jobs","Manage jobs",BriefcaseBusiness],
  ["/admin/users","Manage users",Users],
  ["/jobs","Explore jobs",BriefcaseBusiness],
  ["/notifications","Notifications",Bell]
 ]:user?.role==="recruiter"?[
  ["/recruiter","Overview",LayoutDashboard],
  ["/recruiter/jobs","Manage jobs",BriefcaseBusiness],
  ["/recruiter/applicants","Applicants",Users],
  ["/recruiter/analytics","Analytics",ChartNoAxesCombined],
  ["/notifications","Notifications",Bell]
 ]:[
  ["/student","Dashboard",LayoutDashboard],
  ["/jobs","Find jobs",Search],
  ["/saved","Saved jobs",Heart],
  ["/my-applications","My applications",ClipboardList],
  ["/resume-builder","Resume Builder",FileText],
  ["/profile","My profile",CircleUserRound],
  ["/notifications","Notifications",Bell]
 ];

 return <div className="app-frame">
  <aside className={`sidebar ${open?"sidebar-open":""}`}>
   <Link to="/" className="logo">
    <span className="logo-mark"><BriefcaseBusiness size={19}/></span>
    <span>campus<span className="logo-light">hire</span></span>
   </Link>
   <div className="workspace-label">WORKSPACE</div>
   <nav className="side-nav">
    {links.map(([to,label,Icon])=><NavLink
     key={to} to={to}
     end={to==="/admin"||to==="/recruiter"||to==="/student"}
     onClick={()=>setOpen(false)}
     className={({isActive})=>isActive?"side-link active":"side-link"}
    >
     <Icon size={18}/>
     <span>{label}</span>
     {label==="Notifications"&&unread>0&&<i className="nav-count">{unread}</i>}
    </NavLink>)}
   </nav>
   <div className="sidebar-bottom">
    <div className="help-card">
     <div className="help-icon"><ShieldCheck size={18}/></div>
     <b>Career support</b>
     <p>Build your future, one step at a time.</p>
     <Link to="/jobs">Explore opportunities <ArrowUpRight size={13}/></Link>
    </div>
    {user?<div className="user-mini">
     <div className="avatar">{(user.fullname||"U").slice(0,1).toUpperCase()}</div>
     <div className="user-mini-text"><b>{user.fullname}</b><span>{user.role}</span></div>
     <button className="icon-btn" title="Logout" onClick={logout}><LogOut size={17}/></button>
    </div>:<Link className="button button-wide" to="/login">Sign in</Link>}
   </div>
  </aside>
  {open&&<button className="mobile-scrim" onClick={()=>setOpen(false)} aria-label="Close menu"/>}
  <div className="main-area">
   <header className="top-header">
    <button className="mobile-menu icon-btn" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
    <div className="crumb">Workspace <ChevronRight size={14}/> <b>{active}</b></div>
    <div className="header-right">
     <span className="today-pill"><span className="live-dot"/> Portal is live</span>
     {user?<Link className="header-avatar" to="/profile">{(user.fullname||"U").slice(0,1).toUpperCase()}</Link>:<Link to="/login" className="text-link">Login</Link>}
    </div>
   </header>
   <main className="page-content">{children}</main>
   <footer className="footer">© 2026 Campus Hire <span>Made for students and growing careers</span></footer>
  </div>
 </div>;
}

function PageTitle({eyebrow,title,sub,action}){
 return <div className="page-title">
  <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{sub&&<p>{sub}</p>}</div>
  {action}
 </div>;
}

function StatCard({label,value,change,icon:Icon,tone="blue"}){
 return <div className="stat-card">
  <div className={`stat-icon ${tone}`}><Icon size={19}/></div>
  <div className="stat-label">{label}</div>
  <div className="stat-bottom"><strong>{value??"—"}</strong>{change&&<span className="stat-change"><TrendingUp size={13}/>{change}</span>}</div>
 </div>;
}

function Loading(){
 return <div className="loading"><span className="spinner"/> Loading your workspace…</div>;
}

function Guard({roles,children}){
 const {user,loading}=useAuth();
 if(loading)return <Loading/>;
 if(!user)return <Navigate to="/login"/>;
 if(!roles.includes(user.role))return <Navigate to="/"/>;
 return children;
}

function Home(){
 return <div className="landing">
  <header className="landing-nav">
   <Link to="/" className="logo"><span className="logo-mark"><BriefcaseBusiness size={19}/></span>campus<span className="logo-light">hire</span></Link>
   <nav><Link to="/jobs">Find jobs</Link><a href="#how">How it works</a></nav>
   <div><Link className="text-link" to="/login">Log in</Link><Link className="button" to="/signup">Get started <ArrowUpRight size={15}/></Link></div>
  </header>

  <section className="hero-section">
   <div className="hero-copy">
    <span className="hero-kicker"><span className="live-dot"/> YOUR NEXT CHAPTER STARTS HERE</span>
    <h1>Make your<br/><em>next move</em><br/>count.</h1>
    <p>Discover opportunities, meet ambitious teams, and turn your skills into a career you’re proud of.</p>
    <div className="hero-actions">
     <Link className="button button-lg" to="/jobs">Explore opportunities <ArrowUpRight size={17}/></Link>
     <Link className="button button-outline button-lg" to="/signup">Create free account</Link>
    </div>
    <div className="hero-proof">
     <div className="proof-avatars"><i>A</i><i>R</i><i>S</i><i>+</i></div>
     <span><b>One platform.</b> Your career possibilities.</span>
    </div>
   </div>

   <div className="hero-visual">
    <div className="hero-orbit orbit-one"/>
    <div className="hero-orbit orbit-two"/>
    <div className="hero-illustration">
     <div className="illus-window">
      <div className="illus-top"><i/><i/><i/></div>
      <div className="illus-content">
       <div className="illus-sidebar"><b/><b/><b/><b/></div>
       <div className="illus-main">
        <div className="illus-greeting">Good morning, Alex <span>✦</span></div>
        <div className="illus-line long"/>
        <div className="illus-cards"><i/><i/><i/></div>
        <div className="illus-chart"><b/><b/><b/><b/><b/><b/><b/><b/></div>
        <div className="illus-lines"><i/><i/><i/></div>
       </div>
      </div>
     </div>
    </div>
    <div className="float-card float-job">
     <span className="float-icon"><BriefcaseBusiness size={17}/></span>
     <div><b>New opportunity</b><small>Frontend Developer</small></div>
     <CheckCircle2 size={17} color="#24ad8b"/>
    </div>
    <div className="float-card float-match">
     <div className="match-ring">92%</div>
     <div><b>Great match!</b><small>Your profile stands out</small></div>
    </div>
    <div className="sparkle sparkle-a">✦</div>
    <div className="sparkle sparkle-b">✧</div>
   </div>
  </section>

  <section className="landing-strip">
   <span>YOUR CAREER TOOLKIT</span><b>Discover</b><i/> <b>Apply</b><i/> <b>Grow</b><i/> <b>Get hired</b>
  </section>

  <section className="landing-features" id="how">
   <div className="section-intro"><span className="eyebrow">ONE PLACE. MORE POSSIBILITIES.</span><h2>Everything you need<br/>to move forward.</h2></div>
   <div className="feature-grid">
    <div className="feature-tile"><div className="feature-icon"><Search/></div><h3>Find your fit</h3><p>Explore roles and internships that match your interests and skills.</p></div>
    <div className="feature-tile"><div className="feature-icon mint"><FileText/></div><h3>Show your strengths</h3><p>Build a profile, upload your resume, and make a great first impression.</p></div>
    <div className="feature-tile"><div className="feature-icon amber"><Activity/></div><h3>Track your progress</h3><p>Keep your applications and updates organized in one workspace.</p></div>
   </div>
  </section>

  <footer className="landing-footer"><Link to="/" className="logo"><span className="logo-mark"><BriefcaseBusiness size={17}/></span>campushire</Link><span>Helping talent find its next opportunity.</span></footer>
 </div>;
}

function AuthPage({mode}){
 const {login,register}=useAuth();
 const nav=useNavigate();
 const [form,setForm]=useState({fullname:"",email:"",password:"",role:"student"});
 const [error,setError]=useState("");
 const [busy,setBusy]=useState(false);

 const submit=async e=>{
  e.preventDefault();setBusy(true);setError("");
  try{
   const u=mode==="login"?await login(form):await register(form);
   nav(u.role==="admin"?"/admin":u.role==="recruiter"?"/recruiter":"/student");
  }catch(err){
   setError(err.response?.data?.message||"Unable to continue. Check your details.");
  }finally{setBusy(false);}
 };

 return <div className="auth-layout">
  <div className="auth-side">
   <Link to="/" className="logo"><span className="logo-mark"><BriefcaseBusiness/></span>campushire</Link>
   <div className="auth-promo">
    <span className="eyebrow">YOUR FUTURE, IN FOCUS</span>
    <h2>Good things happen when you take the next step.</h2>
    <p>Find meaningful opportunities and keep your career journey moving.</p>
    <div className="auth-decoration">✦</div>
   </div>
   <span className="auth-side-foot">Campus Hire · Career starts here</span>
  </div>
  <div className="auth-main">
   <div className="auth-form-wrap">
    <Link to="/" className="back-link">← Back to home</Link>
    <span className="eyebrow">{mode==="login"?"WELCOME BACK":"START YOUR JOURNEY"}</span>
    <h1>{mode==="login"?"Sign in to your account":"Create your account"}</h1>
    <p className="muted">{mode==="login"?"Enter your details to access your workspace.":"Join Campus Hire and discover your next opportunity."}</p>
    <form onSubmit={submit}>
     {mode==="signup"&&<>
      <label>Full name<input required placeholder="Your full name" value={form.fullname} onChange={e=>setForm({...form,fullname:e.target.value})}/></label>
      <label>I am a<select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="student">Student</option><option value="recruiter">Recruiter</option></select></label>
     </>}
     <label>Email address<input type="email" required placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
     <label>Password<input type="password" minLength="6" required placeholder="At least 6 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
     {error&&<div className="alert-error">{error}</div>}
     <button className="button button-wide" disabled={busy}>{busy?"Please wait…":mode==="login"?"Sign in":"Create account"} <ArrowUpRight size={16}/></button>
    </form>
    <p className="auth-switch">{mode==="login"?"New to Campus Hire?":"Already have an account?"} <Link to={mode==="login"?"/signup":"/login"}>{mode==="login"?"Create an account":"Sign in"}</Link></p>
   </div>
  </div>
 </div>;
}

function Jobs(){
 const [jobs,setJobs]=useState([]),[search,setSearch]=useState(""),[busy,setBusy]=useState(true);
 const load=()=>{
  setBusy(true);
  api.get("/jobs",{params:{search}})
   .then(r=>setJobs(r.data.jobs||[]))
   .catch(()=>setJobs([]))
   .finally(()=>setBusy(false));
 };
 useEffect(()=>{load();},[]);
 const save=async id=>{
  try{await api.post(`/users/saved/${id}`);alert("Saved jobs updated");}
  catch(e){alert(e.response?.data?.message||"Please sign in as a student");}
 };
 const apply=async id=>{
  try{await api.post(`/jobs/${id}/apply`);alert("Application submitted successfully");}
  catch(e){alert(e.response?.data?.message||"Please sign in as a student");}
 };

 return <AppShell active="Find jobs">
  <PageTitle eyebrow="OPPORTUNITY BOARD" title="Find your next opportunity" sub="Explore roles from teams looking for fresh talent."/>
  <div className="filter-bar">
   <div className="search-box"><Search size={18}/><input placeholder="Search job title or company" value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load()}/></div>
   <button className="button" onClick={load}>Search jobs</button>
  </div>
  {busy?<Loading/>:<div className="job-grid">
   {jobs.map(j=><article className="job-card" key={j._id}>
    <div className="job-card-top"><div className="company-mark">{(j.company||"C").slice(0,1).toUpperCase()}</div><span className="job-type">{j.jobType}</span></div>
    <h3>{j.title}</h3>
    <div className="company-name">{j.company}</div>
    <p className="job-description">{j.description}</p>
    <div className="job-meta"><span><MapPin size={14}/>{j.location||"Flexible"}</span><span><Clock3 size={14}/>{j.experienceLevel||"Entry level"}</span></div>
    <div className="job-card-bottom"><b>{j.salary||"Salary not listed"}</b><div><button className="icon-btn" title="Save job" onClick={()=>save(j._id)}><Heart size={17}/></button><button className="button button-sm" onClick={()=>apply(j._id)}>Apply now</button></div></div>
   </article>)}
  </div>}
  {!busy&&!jobs.length&&<div className="empty-state"><BriefcaseBusiness size={30}/><h3>No opportunities found</h3><p>Try a different keyword or check back soon.</p></div>}
 </AppShell>;
}

/* NEW: STUDENT DASHBOARD */

function StudentDashboard(){
 const {user}=useAuth();
 const [apps,setApps]=useState([]);
 const [saved,setSaved]=useState([]);
 const [profile,setProfile]=useState(null);
 const [busy,setBusy]=useState(true);

 useEffect(()=>{
  let active=true;
  Promise.allSettled([
   api.get("/users/applications"),
   api.get("/users/saved"),
   api.get("/users/profile")
  ]).then(results=>{
   if(!active)return;
   if(results[0].status==="fulfilled")setApps(results[0].value.data.applications||[]);
   if(results[1].status==="fulfilled")setSaved(results[1].value.data.jobs||[]);
   if(results[2].status==="fulfilled")setProfile(results[2].value.data.user||null);
  }).finally(()=>{if(active)setBusy(false);});
  return ()=>{active=false;};
 },[]);

 const shortlisted=apps.filter(a=>a.status==="shortlisted").length;
 const profileFields=[
  profile?.fullname,
  profile?.email,
  profile?.phone,
  profile?.bio,
  profile?.skills?.length,
  profile?.resumeUrl
 ];
 const completed=profileFields.filter(Boolean).length;
 const progress=Math.round(completed/profileFields.length*100);

 return <AppShell active="Dashboard">
  <PageTitle
   eyebrow="STUDENT WORKSPACE"
   title={`Welcome, ${(profile?.fullname||user?.fullname||"Student").split(" ")[0]}`}
   sub="Your career journey, all in one place."
   action={<Link to="/jobs" className="button"><Search size={16}/> Explore jobs</Link>}
  />

  {busy?<Loading/>:<>
   <div className="stats-grid">
    <StatCard label="Applications sent" value={apps.length} icon={FileText} change="Your applications"/>
    <StatCard label="Saved jobs" value={saved.length} icon={Heart} tone="mint" change="Your shortlist"/>
    <StatCard label="Shortlisted" value={shortlisted} icon={CheckCircle2} tone="amber" change="Positive updates"/>
    <StatCard label="Profile completion" value={`${progress}%`} icon={CircleUserRound} tone="rose" change="Complete your profile"/>
   </div>

   <div className="dashboard-grid">
    <section className="content-card">
     <div className="card-heading">
      <div><h3>Profile strength</h3><p>Complete your profile to help recruiters learn about you.</p></div>
      <span className="count-chip">{progress}%</span>
     </div>
     <div style={{height:10,background:"#edf0f7",borderRadius:20,overflow:"hidden",margin:"22px 0"}}>
      <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#5b7cfa,#21b8a6)",borderRadius:20,transition:"width .3s"}}/>
     </div>
     <p className="muted" style={{fontSize:13}}>{completed} of {profileFields.length} profile details completed.</p>
     <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:18}}>
      <Link to="/profile" className="button button-sm">Update profile <ArrowUpRight size={14}/></Link>
      <Link to="/resume-builder" className="button button-sm button-ghost">Build resume <FileText size={14}/></Link>
     </div>
    </section>

    <section className="content-card quick-card">
     <div className="card-heading"><div><h3>Quick actions</h3><p>Keep moving towards your goals.</p></div></div>
     <Link to="/jobs" className="quick-link"><span className="quick-icon"><Search/></span><span><b>Find opportunities</b><small>Explore available jobs</small></span><ChevronRight/></Link>
     <Link to="/resume-builder" className="quick-link"><span className="quick-icon mint"><FileText/></span><span><b>Build your resume</b><small>Create a professional resume</small></span><ChevronRight/></Link>
     <Link to="/my-applications" className="quick-link"><span className="quick-icon amber"><ClipboardList/></span><span><b>Track applications</b><small>Check your application status</small></span><ChevronRight/></Link>
    </section>
   </div>

   <section className="content-card table-card">
    <div className="card-heading">
     <div><h3>Recent applications</h3><p>Keep track of your latest applications.</p></div>
     <Link to="/my-applications" className="view-all">View all <ArrowUpRight size={14}/></Link>
    </div>
    <div className="table-scroll">
     <table>
      <thead><tr><th>POSITION</th><th>COMPANY</th><th>APPLIED ON</th><th>STATUS</th></tr></thead>
      <tbody>
       {apps.slice(0,5).map(a=><tr key={a._id}>
        <td><b>{a.job?.title||"Removed job"}</b></td>
        <td>{a.job?.company||"—"}</td>
        <td>{a.createdAt?new Date(a.createdAt).toLocaleDateString():"—"}</td>
        <td><span className={`status ${a.status}`}>{a.status}</span></td>
       </tr>)}
      </tbody>
     </table>
     {!apps.length&&<p className="empty-inline">You haven't applied to any jobs yet. <Link to="/jobs">Explore jobs</Link></p>}
    </div>
   </section>

   <div className="dashboard-grid">
    <section className="content-card">
     <div className="card-heading"><div><h3>Saved opportunities</h3><p>Jobs you have shortlisted.</p></div><Link to="/saved" className="view-all">View all <ArrowUpRight size={14}/></Link></div>
     {saved.slice(0,3).map(j=><div key={j._id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,padding:"13px 0",borderBottom:"1px solid #edf0f5"}}>
      <div><b style={{fontSize:14}}>{j.title}</b><div className="muted" style={{fontSize:12,marginTop:4}}>{j.company} · {j.location||"Flexible"}</div></div>
      <Link to="/jobs" className="icon-btn"><ArrowUpRight size={16}/></Link>
     </div>)}
     {!saved.length&&<p className="empty-inline">Save jobs that interest you to see them here.</p>}
    </section>
    <section className="content-card">
     <div className="card-heading"><div><h3>Career tip</h3><p>A small step can make a difference.</p></div><span className="quick-icon"><Sparkles size={19}/></span></div>
     <p style={{fontSize:14,lineHeight:1.8,color:"#657087"}}>Keep your profile updated, highlight your strongest skills, and tailor your resume to the opportunities you apply for.</p>
     <Link to="/resume-builder" className="view-all">Improve your resume <ArrowUpRight size={14}/></Link>
    </section>
   </div>
  </>}
 </AppShell>;
}

/* NEW: RESUME BUILDER */

const initialResume={
 name:"",
 role:"",
 email:"",
 phone:"",
 location:"",
 summary:"",
 skills:"",
 education:"",
 experience:"",
 projects:""
};

const resumeInputStyle={
 width:"100%",padding:"11px 13px",border:"1px solid #e3e8f1",
 borderRadius:9,fontSize:13,outline:"none",background:"#fff",
 color:"#26334b",fontFamily:"inherit"
};

function ResumeBuilder(){
 const {user}=useAuth();
 const [resume,setResume]=useState(()=>{
  try{
   const saved=localStorage.getItem("campus-hire-resume");
   return saved?{...initialResume,...JSON.parse(saved)}:{...initialResume};
  }catch{return {...initialResume};}
 });
 const [message,setMessage]=useState("");

 useEffect(()=>{
  try{localStorage.setItem("campus-hire-resume",JSON.stringify(resume));}
  catch{}
 },[resume]);

 useEffect(()=>{
  api.get("/users/profile").then(r=>{
   const p=r.data.user;
   if(!p)return;
   setResume(old=>({
    ...old,
    name:old.name||p.fullname||user?.fullname||"",
    email:old.email||p.email||user?.email||"",
    phone:old.phone||p.phone||"",
    skills:old.skills||(p.skills||[]).join(", ")
   }));
  }).catch(()=>{});
 },[]);

 const update=(key,value)=>setResume(old=>({...old,[key]:value}));
 const skills=useMemo(()=>resume.skills.split(",").map(s=>s.trim()).filter(Boolean),[resume.skills]);
 const lines=value=>value.split("\n").map(x=>x.trim()).filter(Boolean);

 const download=()=>{
  if(!resume.name.trim()){
   setMessage("Please enter your name before downloading your resume.");
   return;
  }
  setMessage("");
  window.print();
 };

 const fields=[
  ["name","Full name","Your full name","text"],
  ["role","Professional headline","e.g. Frontend Developer","text"],
  ["email","Email address","you@example.com","email"],
  ["phone","Phone number","Your contact number","text"],
  ["location","Location","City, State","text"]
 ];

 return <AppShell active="Resume Builder">
  <style>{`
   .resume-builder-grid{display:grid;grid-template-columns:minmax(280px, .9fr) minmax(320px,1.1fr);gap:22px;align-items:start}
   .resume-editor{background:#fff;border:1px solid #e8ecf3;border-radius:15px;padding:22px}
   .resume-editor h3{font-size:16px;margin:0 0 5px;color:#26334b}
   .resume-editor>p{font-size:12px;color:#8993a5;margin:0 0 20px}
   .resume-field{display:flex;flex-direction:column;gap:7px;margin-bottom:14px}
   .resume-field label{font-size:12px;font-weight:700;color:#49566c}
   .resume-field textarea{resize:vertical;min-height:85px}
   .resume-preview{background:#fff;border:1px solid #e8ecf3;border-radius:15px;padding:34px;min-height:650px;box-shadow:0 8px 25px #23395b0a}
   .resume-preview h1{font-size:27px;color:#243451;margin:0 0 5px;overflow-wrap:anywhere}
   .resume-preview .resume-role{font-size:14px;color:#5b7cfa;font-weight:700;margin-bottom:12px}
   .resume-preview .resume-contact{font-size:11px;color:#778297;display:flex;gap:7px;flex-wrap:wrap}
   .resume-preview .resume-summary{font-size:12px;line-height:1.8;color:#526078;margin-top:20px}
   .resume-preview h3{font-size:12px;color:#334563;text-transform:uppercase;letter-spacing:1.2px;border-bottom:1px solid #e7ebf2;padding-bottom:8px;margin:22px 0 10px}
   .resume-preview p{font-size:12px;color:#59667b;line-height:1.7;margin:5px 0;white-space:pre-line}
   .resume-skill-list{display:flex;gap:7px;flex-wrap:wrap}
   .resume-skill-list span{font-size:11px;background:#eff3ff;color:#4867c5;padding:6px 10px;border-radius:20px}
   .resume-actions{display:flex;justify-content:flex-end;gap:10px;margin-bottom:14px}
   @media(max-width:850px){.resume-builder-grid{grid-template-columns:1fr}.resume-preview{min-height:500px}}
   @media print{
    @page{size:A4;margin:15mm}
    body *{visibility:hidden!important}
    .resume-print-area,.resume-print-area *{visibility:visible!important}
    .resume-print-area{position:absolute!important;left:0!important;top:0!important;width:100%!important;min-height:0!important;padding:0!important;margin:0!important;border:0!important;box-shadow:none!important}
    .resume-editor,.resume-actions,.top-header,.sidebar,.footer,.page-title{display:none!important}
    .resume-builder-grid{display:block!important}
    .resume-preview{border:0!important;border-radius:0!important;box-shadow:none!important;padding:0!important;min-height:0!important}
   }
  `}</style>

  <PageTitle
   eyebrow="CAREER TOOLKIT"
   title="Resume Builder"
   sub="Create a professional resume and preview it while you edit."
   action={<button className="button" onClick={download}><Download size={16}/> Download PDF</button>}
  />

  {message&&<div className="notice" style={{marginBottom:15}}>{message}</div>}

  <div className="resume-actions">
   <button className="button button-ghost" onClick={()=>{
    if(window.confirm("Clear all resume details?")){
     setResume({...initialResume});setMessage("Resume details cleared.");
    }
   }}>Clear details</button>
   <button className="button" onClick={download}><Download size={15}/> Download PDF</button>
  </div>

  <div className="resume-builder-grid">
   <section className="resume-editor">
    <h3><FileText size={17} style={{verticalAlign:"middle",marginRight:7}}/>Your information</h3>
    <p>Enter your details below. Your resume preview updates automatically.</p>

    {fields.map(([key,label,placeholder,type])=><div className="resume-field" key={key}>
     <label>{label}</label>
     <input
      type={type}
      style={resumeInputStyle}
      placeholder={placeholder}
      value={resume[key]}
      onChange={e=>update(key,e.target.value)}
     />
    </div>)}

    <div className="resume-field">
     <label>Professional summary</label>
     <textarea style={resumeInputStyle} rows="4" placeholder="Write a short introduction about your skills and career goals..." value={resume.summary} onChange={e=>update("summary",e.target.value)}/>
    </div>

    <div className="resume-field">
     <label>Skills</label>
     <input style={resumeInputStyle} placeholder="React, JavaScript, HTML, CSS" value={resume.skills} onChange={e=>update("skills",e.target.value)}/>
     <small style={{color:"#8993a5",fontSize:11}}>Separate skills with commas.</small>
    </div>

    <div className="resume-field">
     <label>Education</label>
     <textarea style={resumeInputStyle} rows="4" placeholder={"B.Tech in Computer Science\nCollege name | Year"} value={resume.education} onChange={e=>update("education",e.target.value)}/>
     <small style={{color:"#8993a5",fontSize:11}}>Put each qualification on a new line.</small>
    </div>

    <div className="resume-field">
     <label>Experience / Internship</label>
     <textarea style={resumeInputStyle} rows="5" placeholder={"Frontend Developer Intern\nCompany name | Duration\nDescribe your work and responsibilities."} value={resume.experience} onChange={e=>update("experience",e.target.value)}/>
    </div>

    <div className="resume-field">
     <label>Projects</label>
     <textarea style={resumeInputStyle} rows="4" placeholder={"Campus Hire - MERN Project\nBriefly describe the project and technologies used."} value={resume.projects} onChange={e=>update("projects",e.target.value)}/>
    </div>

    <p style={{fontSize:11,color:"#8993a5",marginTop:15}}>Your resume is saved automatically in this browser.</p>
   </section>

   <section className="resume-preview resume-print-area">
    <div style={{borderBottom:"2px solid #5b7cfa",paddingBottom:17}}>
     <h1>{resume.name||"Your Name"}</h1>
     <div className="resume-role">{resume.role||"Professional Headline"}</div>
     <div className="resume-contact">
      {resume.email&&<span>{resume.email}</span>}
      {resume.phone&&<span>· {resume.phone}</span>}
      {resume.location&&<span>· {resume.location}</span>}
     </div>
    </div>

    <div className="resume-summary">
     {resume.summary||"Your professional summary will appear here. Add a short introduction about your background, strengths and career goals."}
    </div>

    <h3>Skills</h3>
    {skills.length?<div className="resume-skill-list">{skills.map((s,i)=><span key={`${s}-${i}`}>{s}</span>)}</div>:<p>Your skills will appear here.</p>}

    <h3>Education</h3>
    {lines(resume.education).length?lines(resume.education).map((x,i)=><p key={i}>{x}</p>):<p>Add your educational qualifications.</p>}

    <h3>Experience</h3>
    {lines(resume.experience).length?lines(resume.experience).map((x,i)=><p key={i}>{x}</p>):<p>Add your internship or work experience.</p>}

    <h3>Projects</h3>
    {lines(resume.projects).length?lines(resume.projects).map((x,i)=><p key={i}>{x}</p>):<p>Add your academic or personal projects.</p>}
   </section>
  </div>
 </AppShell>;
}

/* ADMIN DASHBOARD */

function AdminDashboard(){
 const [data,setData]=useState(null),[error,setError]=useState("");
 useEffect(()=>{api.get("/dashboard/admin").then(r=>setData(r.data)).catch(e=>setError(e.response?.data?.message||"Could not load dashboard"));},[]);
 const monthly=(data?.monthly||[]).map(x=>({month:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][x._id-1],jobs:x.count}));

 return <AppShell active="Overview">
  <PageTitle eyebrow="ADMINISTRATION / OVERVIEW" title="Good to see you, Admin" sub="Here’s what’s happening across your Campus Hire platform." action={<span className="date-chip">Platform overview <Activity size={15}/></span>}/>
  {error&&<div className="alert-error">{error}</div>}
  {!data?<Loading/>:<>
   <div className="stats-grid">
    <StatCard label="Total students" value={data.stats.students} icon={Users} change="Registered talent"/>
    <StatCard label="Recruiters" value={data.stats.recruiters} icon={Building2} tone="mint" change="Hiring partners"/>
    <StatCard label="Active job posts" value={data.stats.jobs} icon={BriefcaseBusiness} tone="amber" change="Opportunities"/>
    <StatCard label="Applications" value={data.stats.applications} icon={FileText} tone="rose" change="Total received"/>
   </div>
   <div className="dashboard-grid">
    <section className="content-card chart-card">
     <div className="card-heading"><div><h3>Job posting activity</h3><p>Monthly jobs added to the platform</p></div><span className="legend-dot">Jobs</span></div>
     <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={monthly}><defs><linearGradient id="jobsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5b7cfa" stopOpacity={.22}/><stop offset="95%" stopColor="#5b7cfa" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5"/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:"#929bad",fontSize:11}}/><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill:"#929bad",fontSize:11}}/><Tooltip/><Area type="monotone" dataKey="jobs" stroke="#5b7cfa" strokeWidth={3} fill="url(#jobsFill)"/></AreaChart></ResponsiveContainer></div>
    </section>
    <section className="content-card quick-card">
     <div className="card-heading"><div><h3>Quick actions</h3><p>Manage your platform</p></div></div>
     <Link to="/admin/analytics" className="quick-link"><span className="quick-icon"><ChartNoAxesCombined/></span><span><b>View analytics</b><small>Platform performance</small></span><ChevronRight/></Link>
     <Link to="/jobs" className="quick-link"><span className="quick-icon mint"><Search/></span><span><b>Browse opportunities</b><small>Review live job posts</small></span><ChevronRight/></Link>
     <Link to="/notifications" className="quick-link"><span className="quick-icon amber"><Bell/></span><span><b>Notifications</b><small>Latest platform updates</small></span><ChevronRight/></Link>
    </section>
   </div>
   <section className="content-card table-card">
    <div className="card-heading"><div><h3>Recently posted jobs</h3><p>Latest opportunities added by recruiters</p></div><Link to="/jobs" className="view-all">View all <ArrowUpRight size={14}/></Link></div>
    <div className="table-scroll"><table><thead><tr><th>POSITION</th><th>COMPANY</th><th>LOCATION</th><th>POSTED</th><th>STATUS</th></tr></thead><tbody>
     {data.recentJobs.map(j=><tr key={j._id}><td><b>{j.title}</b></td><td>{j.company}</td><td>{j.location||"—"}</td><td>{new Date(j.createdAt).toLocaleDateString()}</td><td><span className={`status ${j.status}`}>{j.status}</span></td></tr>)}
    </tbody></table>{!data.recentJobs.length&&<p className="empty-inline">No jobs posted yet.</p>}</div>
   </section>
  </>}
 </AppShell>;
}


function AdminJobsPage(){
 const blank={
  title:"",
  company:"",
  description:"",
  location:"",
  jobType:"Full-time",
  salary:"",
  experienceLevel:"Entry level"
 };

 const [jobs,setJobs]=useState([]);
 const [busy,setBusy]=useState(true);
 const [message,setMessage]=useState("");
 const [editing,setEditing]=useState(null);
 const [showForm,setShowForm]=useState(false);
 const [form,setForm]=useState(blank);

 const load=()=>{
  setBusy(true);
  api.get("/jobs")
   .then(r=>setJobs(r.data.jobs||[]))
   .catch(e=>setMessage(e.response?.data?.message||"Could not load jobs"))
   .finally(()=>setBusy(false));
 };

 useEffect(()=>{load();},[]);

 const edit=j=>{
  setEditing(j._id);
  setForm({
   title:j.title||"",
   company:j.company||"",
   description:j.description||"",
   location:j.location||"",
   jobType:j.jobType||"Full-time",
   salary:j.salary||"",
   experienceLevel:j.experienceLevel||"Entry level"
  });
  setShowForm(true);
  setMessage("");
  window.scrollTo({top:0,behavior:"smooth"});
 };

 const cancel=()=>{
  setEditing(null);
  setForm(blank);
  setShowForm(false);
 };

 const save=async e=>{
  e.preventDefault();
  setMessage("");

  try{
   await api.put(`/jobs/${editing}`,form);
   setMessage("Job updated successfully.");
   cancel();
   load();
  }catch(e){
   setMessage(e.response?.data?.message||"Could not update job.");
  }
 };

 const del=async id=>{
  if(!window.confirm("Are you sure you want to delete this job and its applications?"))return;

  try{
   await api.delete(`/jobs/${id}`);
   setMessage("Job deleted successfully.");
   load();
  }catch(e){
   setMessage(e.response?.data?.message||"Could not delete job.");
  }
 };

 return <AppShell active="Manage jobs">
  <PageTitle
   eyebrow="ADMINISTRATION / JOB MANAGEMENT"
   title="Manage all jobs"
   sub="Review, edit and remove job posts across the platform."
   action={<button className="button button-ghost" onClick={load}>Refresh jobs</button>}
  />

  {message&&<div className="notice" style={{marginBottom:16}}>
   {message}
   <button onClick={()=>setMessage("")}>×</button>
  </div>}

  {showForm&&<form className="content-card job-form" onSubmit={save}>
   <div className="card-heading">
    <div>
     <h3>Edit job post</h3>
     <p>Update the job details below.</p>
    </div>
    <button type="button" className="icon-btn" onClick={cancel}>×</button>
   </div>

   <div className="form-grid">
    {[["title","Job title"],["company","Company"],["location","Location"],["salary","Salary / stipend"]].map(([k,l])=>
     <label key={k}>{l}
      <input
       required={k==="title"||k==="company"}
       value={form[k]}
       onChange={e=>setForm({...form,[k]:e.target.value})}
      />
     </label>
    )}

    <label>Job type
     <select value={form.jobType} onChange={e=>setForm({...form,jobType:e.target.value})}>
      <option>Full-time</option>
      <option>Internship</option>
      <option>Part-time</option>
      <option>Contract</option>
     </select>
    </label>

    <label>Experience
     <select value={form.experienceLevel} onChange={e=>setForm({...form,experienceLevel:e.target.value})}>
      <option>Entry level</option>
      <option>Fresher</option>
      <option>1-2 years</option>
      <option>Experienced</option>
     </select>
    </label>

    <label className="span-two">Description
     <textarea
      required
      value={form.description}
      onChange={e=>setForm({...form,description:e.target.value})}
     />
    </label>
   </div>

   <div className="form-actions">
    <button type="button" className="button button-ghost" onClick={cancel}>Cancel</button>
    <button className="button">Save changes</button>
   </div>
  </form>}

  <section className="content-card table-card">
   <div className="card-heading">
    <div>
     <h3>All active job posts</h3>
     <p>Manage jobs posted by recruiters.</p>
    </div>
    <span className="count-chip">{jobs.length} jobs</span>
   </div>

   {busy?<Loading/>:<div className="table-scroll">
    <table>
     <thead>
      <tr>
       <th>POSITION</th>
       <th>COMPANY</th>
       <th>LOCATION</th>
       <th>TYPE</th>
       <th>POSTED</th>
       <th>STATUS</th>
       <th>ACTIONS</th>
      </tr>
     </thead>
     <tbody>
      {jobs.map(j=><tr key={j._id}>
       <td><b>{j.title}</b></td>
       <td>{j.company}</td>
       <td>{j.location||"—"}</td>
       <td>{j.jobType||"—"}</td>
       <td>{j.createdAt?new Date(j.createdAt).toLocaleDateString():"—"}</td>
       <td><span className={`status ${j.status}`}>{j.status}</span></td>
       <td>
        <div className="table-actions">
         <button className="icon-btn" title="Edit job" onClick={()=>edit(j)}>
          <Pencil size={15}/>
         </button>
         <button className="icon-btn danger-icon" title="Delete job" onClick={()=>del(j._id)}>
          <Trash2 size={15}/>
         </button>
        </div>
       </td>
      </tr>)}
     </tbody>
    </table>

    {!jobs.length&&<p className="empty-inline">No active jobs found.</p>}
   </div>}
  </section>
 </AppShell>;
}



function AdminUsersPage(){
 const [users,setUsers]=useState([]);
 const [busy,setBusy]=useState(true);
 const [message,setMessage]=useState("");
 const [filter,setFilter]=useState("all");
 const [search,setSearch]=useState("");

 useEffect(()=>{
  api.get("/users/admin/all")
   .then(r=>setUsers(r.data.users||[]))
   .catch(e=>setMessage(e.response?.data?.message||"Could not load users"))
   .finally(()=>setBusy(false));
 },[]);

 const filteredUsers=users.filter(user=>{
  const matchesRole=filter==="all"||user.role===filter;
  const term=search.toLowerCase();
  const matchesSearch=
   (user.fullname||"").toLowerCase().includes(term)||
   (user.email||"").toLowerCase().includes(term);
  return matchesRole&&matchesSearch;
 });

 return <AppShell active="Manage users">
  <PageTitle
   eyebrow="ADMINISTRATION / USER MANAGEMENT"
   title="Manage users"
   sub="View all registered students and recruiters."
  />

  <div className="stats-grid" style={{marginBottom:20}}>
   <div className="stat-card">
    <span>Total users</span>
    <h2>{users.length}</h2>
   </div>
   <div className="stat-card">
    <span>Students</span>
    <h2>{users.filter(u=>u.role==="student").length}</h2>
   </div>
   <div className="stat-card">
    <span>Recruiters</span>
    <h2>{users.filter(u=>u.role==="recruiter").length}</h2>
   </div>
  </div>

  {message&&<div className="notice">{message}</div>}

  <section className="content-card table-card">
   <div className="card-heading">
    <div>
     <h3>Registered users</h3>
     <p>Students and recruiters on Campus Hire.</p>
    </div>
    <span className="count-chip">{filteredUsers.length} users</span>
   </div>

   <div className="filter-bar" style={{marginBottom:18}}>
    <div className="search-box">
     <Search size={18}/>
     <input
      placeholder="Search name or email"
      value={search}
      onChange={e=>setSearch(e.target.value)}
     />
    </div>

    <select value={filter} onChange={e=>setFilter(e.target.value)}>
     <option value="all">All users</option>
     <option value="student">Students</option>
     <option value="recruiter">Recruiters</option>
    </select>
   </div>

   {busy?<Loading/>:<div className="table-scroll">
    <table>
     <thead>
      <tr>
       <th>NAME</th>
       <th>EMAIL</th>
       <th>ROLE</th>
       <th>PHONE</th>
       <th>JOINED</th>
      </tr>
     </thead>
     <tbody>
      {filteredUsers.map(user=><tr key={user._id}>
       <td><b>{user.fullname}</b></td>
       <td>{user.email}</td>
       <td>
        <span className="status active">
         {user.role}
        </span>
       </td>
       <td>{user.phone||"—"}</td>
       <td>
        {user.createdAt?
         new Date(user.createdAt).toLocaleDateString():
         "—"}
       </td>
      </tr>)}
     </tbody>
    </table>

    {!filteredUsers.length&&
     <p className="empty-inline">No users found.</p>}
   </div>}
  </section>
 </AppShell>;
}
/* RECRUITER DASHBOARD */

function RecruiterDashboard(){
 const [data,setData]=useState(null),[message,setMessage]=useState(""),[editing,setEditing]=useState(null),[showForm,setShowForm]=useState(false);
 const blank={title:"",company:"",description:"",location:"",jobType:"Full-time",salary:"",experienceLevel:"Entry level"};
 const [form,setForm]=useState(blank);
 const load=()=>api.get("/dashboard/recruiter").then(r=>setData(r.data)).catch(e=>setMessage(e.response?.data?.message||"Unable to load recruiter data"));
 useEffect(()=>{load();},[]);
 const save=async e=>{
  e.preventDefault();
  try{
   if(editing)await api.put(`/jobs/${editing}`,form);
   else await api.post("/jobs",form);
   setMessage(editing?"Job updated successfully":"Job published successfully");
   setEditing(null);setForm(blank);setShowForm(false);load();
  }catch(e){setMessage(e.response?.data?.message||"Could not save job");}
 };
 const edit=j=>{
  setEditing(j._id);
  setForm({title:j.title,company:j.company,description:j.description,location:j.location||"",jobType:j.jobType||"Full-time",salary:j.salary||"",experienceLevel:j.experienceLevel||"Entry level"});
  setShowForm(true);
 };
 const del=async id=>{
  if(!window.confirm("Delete this job and its applications?"))return;
  try{await api.delete(`/jobs/${id}`);load();}
  catch(e){setMessage(e.response?.data?.message||"Delete failed");}
 };
 const status=async(id,s)=>{
  try{await api.patch(`/jobs/applications/${id}/status`,{status:s});load();}
  catch(e){setMessage(e.response?.data?.message||"Status update failed");}
 };

 return <AppShell active="Overview">
  <PageTitle eyebrow="RECRUITER WORKSPACE" title="Your hiring overview" sub="Manage roles, review applicants and keep your hiring moving." action={<button className="button" onClick={()=>{setEditing(null);setForm(blank);setShowForm(!showForm)}}><Plus size={16}/> Post a job</button>}/>
  {message&&<div className="notice">{message}<button onClick={()=>setMessage("")}>×</button></div>}
  {data?<>
   <div className="stats-grid three-stats">
    <StatCard label="Your job posts" value={data.stats.jobs} icon={BriefcaseBusiness}/>
    <StatCard label="Applications" value={data.stats.applications} icon={Users} tone="mint"/>
    <StatCard label="Shortlisted" value={data.stats.shortlisted} icon={CheckCircle2} tone="amber"/>
   </div>
   {showForm&&<form className="content-card job-form" onSubmit={save}>
    <div className="card-heading"><div><h3>{editing?"Edit job post":"Create a new job post"}</h3><p>Share the details candidates need to know.</p></div><button type="button" className="icon-btn" onClick={()=>setShowForm(false)}>×</button></div>
    <div className="form-grid">
     {[["title","Job title"],["company","Company"],["location","Location"],["salary","Salary / stipend"]].map(([k,l])=><label key={k}>{l}<input required={k==="title"||k==="company"} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/></label>)}
     <label>Job type<select value={form.jobType} onChange={e=>setForm({...form,jobType:e.target.value})}><option>Full-time</option><option>Internship</option><option>Part-time</option><option>Contract</option></select></label>
     <label>Experience<select value={form.experienceLevel} onChange={e=>setForm({...form,experienceLevel:e.target.value})}><option>Entry level</option><option>Fresher</option><option>1-2 years</option><option>Experienced</option></select></label>
     <label className="span-two">Description<textarea required value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label>
    </div>
    <div className="form-actions"><button type="button" className="button button-ghost" onClick={()=>setShowForm(false)}>Cancel</button><button className="button">{editing?"Save changes":"Publish job"}</button></div>
   </form>}
   <section className="content-card table-card">
    <div className="card-heading"><div><h3>Your job posts</h3><p>Edit or remove opportunities you manage.</p></div></div>
    <div className="table-scroll"><table><thead><tr><th>POSITION</th><th>COMPANY</th><th>TYPE</th><th>POSTED</th><th>ACTIONS</th></tr></thead><tbody>
     {data.jobs.map(j=><tr key={j._id}><td><b>{j.title}</b></td><td>{j.company}</td><td>{j.jobType}</td><td>{new Date(j.createdAt).toLocaleDateString()}</td><td><div className="table-actions"><button className="icon-btn" onClick={()=>edit(j)} title="Edit"><Pencil size={15}/></button><button className="icon-btn danger-icon" onClick={()=>del(j._id)} title="Delete"><Trash2 size={15}/></button></div></td></tr>)}
    </tbody></table>{!data.jobs.length&&<p className="empty-inline">You haven't posted a job yet.</p>}</div>
   </section>
   <ApplicantsPanel data={data} onStatus={status}/>
  </>:<Loading/>}
 </AppShell>;
}

function ApplicantsPanel({data,onStatus}){
 return <section className="content-card table-card">
  <div className="card-heading"><div><h3>Recent applicants</h3><p>Review candidates who applied to your jobs.</p></div><span className="count-chip">{data.applications.length} total</span></div>
  <div className="applicant-list">
   {data.applications.map(a=><div className="applicant-row" key={a._id}>
    <div className="avatar">{(a.student?.fullname||"S").slice(0,1)}</div>
    <div className="applicant-info"><b>{a.student?.fullname||"Student"}</b><span>{a.student?.email} · {a.job?.title}</span></div>
    {a.student?.resumeUrl&&<a className="resume-link" href={`http://localhost:8000${a.student.resumeUrl}`} target="_blank" rel="noreferrer"><FileText size={14}/> Resume</a>}
    <select value={a.status} onChange={e=>onStatus(a._id,e.target.value)}><option value="submitted">Submitted</option><option value="reviewing">Reviewing</option><option value="shortlisted">Shortlisted</option><option value="rejected">Rejected</option></select>
   </div>)}
   {!data.applications.length&&<p className="empty-inline">No applications received yet.</p>}
  </div>
 </section>;
}

function ApplicantsPage(){
 const [data,setData]=useState(null);
 const load=()=>api.get("/dashboard/recruiter").then(r=>setData(r.data));
 useEffect(()=>{load()},[]);
 const update=async(id,status)=>{await api.patch(`/jobs/applications/${id}/status`,{status});load();};
 return <AppShell active="Applicants">
  <PageTitle eyebrow="TALENT PIPELINE" title="Applicants" sub="Review every application across your job posts."/>
  {!data?<Loading/>:<ApplicantsPanel data={data} onStatus={update}/>}
 </AppShell>;
}

function Profile(){
 const [profile,setProfile]=useState(null),[message,setMessage]=useState("");
 useEffect(()=>{api.get("/users/profile").then(r=>setProfile(r.data.user)).catch(()=>{});},[]);
 const submit=async e=>{
  e.preventDefault();const fd=new FormData(e.target);
  try{
   const {data}=await api.put("/users/profile",fd);
   setProfile(data.user);setMessage("Your profile has been updated.");
  }catch(err){setMessage(err.response?.data?.message||"Could not update profile.");}
 };

 return <AppShell active="My profile">
  <PageTitle eyebrow="YOUR PROFILE" title="Tell your story" sub="Help recruiters understand your strengths and experience."/>
  {profile?<form className="content-card profile-form" onSubmit={submit}>
   <div className="profile-cover"><div className="profile-avatar">{profile.fullname?.slice(0,1)}</div><div><h2>{profile.fullname}</h2><span>{profile.email}</span></div></div>
   <div className="form-grid">
    <label>Full name<input name="fullname" defaultValue={profile.fullname}/></label>
    <label>Phone number<input name="phone" defaultValue={profile.phone||""}/></label>
    <label className="span-two">Short bio<textarea name="bio" defaultValue={profile.bio||""} placeholder="Tell recruiters a little about yourself…"/></label>
    <label className="span-two">Skills <small>Separate each skill with a comma</small><input name="skills" defaultValue={(profile.skills||[]).join(", ")} placeholder="React, JavaScript, Node.js"/></label>
    <label className="span-two upload-box"><UploadCloud size={22}/><b>Upload your resume</b><span>PDF, DOC or DOCX · Maximum 5 MB</span><input name="resume" type="file" accept=".pdf,.doc,.docx"/></label>
   </div>
   {profile.resumeOriginalName&&<p className="current-resume"><FileText size={15}/> Current resume: {profile.resumeOriginalName}</p>}
   {message&&<div className="notice">{message}</div>}
   <div className="form-actions"><button className="button">Save profile</button></div>
  </form>:<Loading/>}
 </AppShell>;
}

function SavedJobs(){
 const [jobs,setJobs]=useState([]);
 const load=()=>api.get("/users/saved").then(r=>setJobs(r.data.jobs||[])).catch(()=>{});
 useEffect(()=>{load()},[]);
 const remove=async id=>{await api.post(`/users/saved/${id}`);load();};

 return <AppShell active="Saved jobs">
  <PageTitle eyebrow="YOUR SHORTLIST" title="Saved opportunities" sub="The roles you want to come back to."/>
  {jobs.length?<div className="job-grid">{jobs.map(j=><article className="job-card" key={j._id}>
   <div className="job-card-top"><div className="company-mark">{j.company?.slice(0,1)}</div><button className="icon-btn" onClick={()=>remove(j._id)}><Heart fill="#e86b78" color="#e86b78"/></button></div>
   <h3>{j.title}</h3><div className="company-name">{j.company}</div>
   <div className="job-meta"><span><MapPin size={14}/>{j.location||"Flexible"}</span><span>{j.jobType}</span></div>
  </article>)}</div>:<div className="empty-state"><Bookmark size={30}/><h3>Your shortlist is waiting</h3><p>Save interesting jobs and they’ll appear here.</p><Link className="button" to="/jobs">Explore jobs</Link></div>}
 </AppShell>;
}

function MyApplications(){
 const [apps,setApps]=useState([]);
 useEffect(()=>{api.get("/users/applications").then(r=>setApps(r.data.applications||[])).catch(()=>{});},[]);

 return <AppShell active="My applications">
  <PageTitle eyebrow="APPLICATION TRACKER" title="My applications" sub="Stay up to date with your job application journey."/>
  <div className="content-card table-card">
   <div className="table-scroll"><table><thead><tr><th>ROLE</th><th>COMPANY</th><th>APPLIED ON</th><th>STATUS</th></tr></thead><tbody>
    {apps.map(a=><tr key={a._id}><td><b>{a.job?.title||"Removed job"}</b></td><td>{a.job?.company||"—"}</td><td>{new Date(a.createdAt).toLocaleDateString()}</td><td><span className={`status ${a.status}`}>{a.status}</span></td></tr>)}
   </tbody></table>{!apps.length&&<p className="empty-inline">Your applications will appear here after you apply.</p>}</div>
  </div>
 </AppShell>;
}

function Notifications(){
 const [items,setItems]=useState([]);
 const load=()=>api.get("/notifications").then(r=>setItems(r.data.notifications||[])).catch(()=>{});
 useEffect(()=>{load()},[]);
 const read=async id=>{await api.patch(`/notifications/${id}/read`);load();};
 const all=async()=>{await api.patch("/notifications/read-all");load();};

 return <AppShell active="Notifications">
  <PageTitle eyebrow="UPDATES" title="Notifications" sub="Important updates from your Campus Hire activity." action={<button className="button button-ghost" onClick={all}>Mark all as read</button>}/>
  <div className="content-card notification-list">
   {items.map(n=><div className={`notification-row ${n.read?"":"unread"}`} key={n._id}>
    <div className="notification-icon"><Bell size={17}/></div>
    <div className="notification-copy"><b>{n.message}</b><span>{new Date(n.createdAt).toLocaleString()}</span></div>
    {!n.read&&<button className="button button-sm button-ghost" onClick={()=>read(n._id)}>Mark read</button>}
   </div>)}
   {!items.length&&<div className="empty-state"><Bell size={28}/><h3>You're all caught up</h3><p>New updates will show up here.</p></div>}
  </div>
 </AppShell>;
}

function AnalyticsPage(){
 const [a,setA]=useState(null);
 useEffect(()=>{api.get("/dashboard/analytics").then(r=>setA(r.data)).catch(()=>{});},[]);

 return <AppShell active="Analytics">
  <PageTitle eyebrow="PERFORMANCE INSIGHTS" title="Analytics overview" sub="A clear view of activity across your hiring pipeline."/>
  {!a?<Loading/>:<>
   <div className="stats-grid three-stats">
    <StatCard label="Job posts" value={a.totalJobs} icon={BriefcaseBusiness}/>
    <StatCard label="Applications" value={a.totalApplications} icon={Users} tone="mint"/>
    <StatCard label="Shortlisted" value={a.byStatus.find(x=>x.status==="shortlisted")?.count||0} icon={CheckCircle2} tone="amber"/>
   </div>
   <div className="dashboard-grid">
    <section className="content-card chart-card">
     <div className="card-heading"><div><h3>Application pipeline</h3><p>Applications by current status</p></div></div>
     <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={a.byStatus} barSize={38}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf0f5"/><XAxis dataKey="status" axisLine={false} tickLine={false} tick={{fill:"#929bad",fontSize:11}}/><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill:"#929bad",fontSize:11}}/><Tooltip/><Bar dataKey="count" radius={[7,7,0,0]}>{a.byStatus.map((x,i)=><Cell key={x.status} fill={moneyColors[i]}/>)}</Bar></BarChart></ResponsiveContainer></div>
    </section>
    <section className="content-card chart-card">
     <div className="card-heading"><div><h3>Status distribution</h3><p>Share of all applications</p></div></div>
     <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={a.byStatus} dataKey="count" nameKey="status" innerRadius={58} outerRadius={88} paddingAngle={4}>{a.byStatus.map((x,i)=><Cell key={x.status} fill={moneyColors[i]}/>)}</Pie><Tooltip/><Legend iconType="circle"/></PieChart></ResponsiveContainer></div>
    </section>
   </div>
  </>}
 </AppShell>;
}

export default function App(){
 const {loading}=useAuth();
 if(loading)return <Loading/>;

 return <Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/login" element={<AuthPage mode="login"/>}/>
  <Route path="/signup" element={<AuthPage mode="signup"/>}/>
  <Route path="/jobs" element={<Jobs/>}/>

  <Route path="/student" element={<Guard roles={["student"]}><StudentDashboard/></Guard>}/>
  <Route path="/resume-builder" element={<Guard roles={["student"]}><ResumeBuilder/></Guard>}/>
  <Route path="/profile" element={<Guard roles={["student"]}><Profile/></Guard>}/>
  <Route path="/saved" element={<Guard roles={["student"]}><SavedJobs/></Guard>}/>
  <Route path="/my-applications" element={<Guard roles={["student"]}><MyApplications/></Guard>}/>

  <Route path="/notifications" element={<Guard roles={["student","recruiter","admin"]}><Notifications/></Guard>}/>
  <Route path="/admin" element={<Guard roles={["admin"]}><AdminDashboard/></Guard>}/>
  <Route path="/admin/analytics" element={<Guard roles={["admin"]}><AnalyticsPage/></Guard>}/>
  <Route path="/admin/jobs" element={<Guard roles={["admin"]}><AdminJobsPage/></Guard>}/>
  <Route path="/admin/users" element={<Guard roles={["admin"]}><AdminUsersPage/></Guard>}/>
  <Route path="/recruiter" element={<Guard roles={["recruiter","admin"]}><RecruiterDashboard/></Guard>}/>
  <Route path="/recruiter/jobs" element={<Guard roles={["recruiter","admin"]}><RecruiterDashboard/></Guard>}/>
  <Route path="/recruiter/applicants" element={<Guard roles={["recruiter","admin"]}><ApplicantsPage/></Guard>}/>
  <Route path="/recruiter/analytics" element={<Guard roles={["recruiter","admin"]}><AnalyticsPage/></Guard>}/>
  <Route path="*" element={<Home/>}/>
 </Routes>;
}
