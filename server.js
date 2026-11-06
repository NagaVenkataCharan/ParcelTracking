require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./src/db');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
const wrap = fn => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next);

app.post('/api/customers',wrap(async(req,res)=>{
 const {name,email,phone,address}=req.body;
 if(!name||!email||!phone||!address) return res.status(400).json({message:'All customer fields are required.'});
 const [r]=await db.execute('INSERT INTO customers(name,email,phone,address) VALUES(?,?,?,?)',[name.trim(),email.trim(),phone.trim(),address.trim()]);
 res.status(201).json({customerId:r.insertId,message:'Customer created.'});
}));
app.get('/api/customers',wrap(async(req,res)=>{
 const [rows]=await db.query('SELECT customer_id,name,email,phone,address FROM customers ORDER BY customer_id DESC'); res.json(rows);
}));
app.post('/api/parcels',wrap(async(req,res)=>{
 const {customer_id,sender_address,receiver_name,receiver_phone,receiver_address,weight,booking_date}=req.body;
 if(!customer_id||!sender_address||!receiver_name||!receiver_phone||!receiver_address||!weight||Number(weight)<=0||!booking_date)
  return res.status(400).json({message:'Complete all parcel fields. Weight must be greater than zero.'});
 const [r]=await db.execute(`INSERT INTO parcels(customer_id,sender_address,receiver_name,receiver_phone,receiver_address,weight,booking_date,status) VALUES(?,?,?,?,?,?,?,'Booked')`,
 [customer_id,sender_address.trim(),receiver_name.trim(),receiver_phone.trim(),receiver_address.trim(),Number(weight),booking_date]);
 await db.execute('INSERT INTO tracking(parcel_id,current_location,tracking_status,remarks) VALUES(?,?,?,?)',[r.insertId,'Booking Office','Booked','Parcel booking created.']);
 res.status(201).json({parcelId:r.insertId,trackingNumber:'CT'+String(r.insertId).padStart(8,'0'),message:'Parcel booked successfully.'});
}));
app.get('/api/track/:number',wrap(async(req,res)=>{
 const raw=req.params.number.toUpperCase(); const m=raw.match(/^CT(\d{1,10})$/); const id=m?Number(m[1]):Number(raw);
 if(!Number.isInteger(id)||id<1) return res.status(400).json({message:'Enter a valid tracking number, e.g. CT00000001.'});
 const [p]=await db.execute(`SELECT p.*,c.name customer_name FROM parcels p JOIN customers c ON c.customer_id=p.customer_id WHERE p.parcel_id=?`,[id]);
 if(!p.length) return res.status(404).json({message:'Parcel not found.'});
 const [updates]=await db.execute('SELECT * FROM tracking WHERE parcel_id=? ORDER BY updated_at DESC,tracking_id DESC',[id]);
 res.json({trackingNumber:'CT'+String(id).padStart(8,'0'),parcel:p[0],updates});
}));
app.get('/api/parcels',wrap(async(req,res)=>{
 const [rows]=await db.query(`SELECT p.parcel_id,p.customer_id,c.name customer_name,p.receiver_name,p.receiver_address,p.weight,p.booking_date,p.status FROM parcels p JOIN customers c ON c.customer_id=p.customer_id ORDER BY p.parcel_id DESC`);res.json(rows);
}));
app.post('/api/parcels/:id/tracking',wrap(async(req,res)=>{
 const id=Number(req.params.id),{current_location,tracking_status,remarks}=req.body;
 const allowed=['Picked Up','In Transit','Out for Delivery','Delivered','Delayed','Cancelled'];
 if(!Number.isInteger(id)||id<1||!current_location||!allowed.includes(tracking_status)) return res.status(400).json({message:'Enter a valid parcel, location and status.'});
 const conn=await db.getConnection();
 try { await conn.beginTransaction();
  const [p]=await conn.execute('SELECT parcel_id FROM parcels WHERE parcel_id=?',[id]); if(!p.length){await conn.rollback();return res.status(404).json({message:'Parcel not found.'});}
  await conn.execute('INSERT INTO tracking(parcel_id,current_location,tracking_status,remarks) VALUES(?,?,?,?)',[id,current_location.trim(),tracking_status,(remarks||'').trim()]);
  await conn.execute('UPDATE parcels SET status=? WHERE parcel_id=?',[tracking_status,id]); await conn.commit();
 } catch(e){await conn.rollback();throw e;} finally{conn.release();}
 res.status(201).json({message:'Tracking update saved.'});
}));
app.get('/api/health',(req,res)=>res.json({status:'ok'}));
app.use((err,req,res,next)=>{console.error(err);res.status(err.code==='ER_DUP_ENTRY'?409:500).json({message:err.code==='ER_DUP_ENTRY'?'Customer email already exists.':'Server/database error. Check terminal and .env settings.'});});
const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`Courier Tracking System: http://localhost:${port}`));
