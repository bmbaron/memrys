// import { Router } from 'express';
// import multer from 'multer';
// import { authenticateUser } from '../utils/authenticateUser';
//
// const router = Router();
// const API_URL =
//   'https://api.cloudflare.com/client/v4/accounts/cea8bd20c1ade1f1ddeca8c1a5ef7daf/images/v1';
// const TOKEN = 'kNKUZafywUwj25EvfhaaSmVNEFxSwR3cE6ckv4uv';
//
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
// router.post('/', authenticateUser, async (req, res) => {
//   console.log(req.body);
//   const response = await fetch(API_URL, {
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${TOKEN}`
//     },
//     body: req.body
//   });
//   console.log(Date(), response);
// });
//
// export default router;
