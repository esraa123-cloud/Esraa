---
trigger: always_on
---

أريد منك تجهيز مشروع Skill Swap الموجود في هذا المستودع ليكون جاهزًا للرفع على GitHub وتشغيله بشكل صحيح في بيئة Production.

المشروع عبارة عن:
- React + Vite Frontend
- Node.js + Express Backend
- MongoDB + Mongoose
- JWT Authentication
- REST API
- Chat APIs
- Skills
- Swap Requests

المطلوب منك:

1. افحص المشروع بالكامل أولًا، ولا تحذف أو تعطل أي Feature موجودة.

2. افحص بنية المشروع وحدد بوضوح:
   - Frontend
   - Backend
   - API routes
   - Controllers
   - Models
   - Middleware
   - Environment variables
   - package.json files

3. جهز Backend بحيث يكون Production-ready.

4. اجعل Express app يتم تصديره بشكل صحيح:
   module.exports = app;

5. لا تستخدم app.listen() عند تشغيل Backend كـ Serverless Function.
   اجعل app.listen() يعمل فقط عند التشغيل المحلي المباشر.

6. جهز Backend بحيث يمكن تشغيله محليًا باستخدام:
   npm start

7. جهز Backend بحيث يمكن تشغيله على منصة Serverless إذا كانت مناسبة للمشروع.

8. لا تحذف WebSocket أو SSE إذا وجدت أي استخدام فعلي لهما.
   افحص المشروع أولًا، وإذا لم يكونا مستخدمين فلا تضفهما ولا تحذف أي شيء متعلق بميزات أخرى.

9. افحص chat functionality جيدًا، ولا تحذف chat routes أو controllers أو models.

10. اجعل MongoDB connection مناسبة للـ serverless:
    - لا تنشئ اتصالًا جديدًا مع كل request إذا كان الاتصال موجودًا.
    - استخدم MONGO_URI من environment variables.
    - لا تستخدم localhost في Production.
    - لا تستخدم MongoMemoryServer في Production.

11. يجب أن تكون المتغيرات:
    MONGO_URI
    JWT_SECRET
    JWT_EXPIRES_IN
    CLIENT_URL

12. لا تضع أي passwords أو secrets داخل الكود.

13. أنشئ أو عدل .env.example ليحتوي فقط على أسماء المتغيرات، مثل:

    MONGO_URI=
    JWT_SECRET=
    JWT_EXPIRES_IN=7d
    CLIENT_URL=http://localhost:5173

14. تأكد أن .env و .env.local غير موجودين في Git وأنهما موجودان في .gitignore.

15. افحص CORS واجعله يسمح للـ Frontend URL الموجود في CLIENT_URL.

16. Frontend:
    افحص src/api/client.js.
    اجعل API URL يعتمد على:
    import.meta.env.VITE_API_URL

    ولا تجعل localhost هو الرابط المستخدم في Production.

17. أنشئ/حدّث:
    .env.example

    للـ Frontend ليحتوي:

    VITE_API_URL=http://localhost:5000/api

18. في Production يجب أن يتم وضع:
    VITE_API_URL
    من Environment Variables الخاصة بمنصة استضافة الـ Frontend.

19. افحص جميع API calls في Frontend وتأكد أنها تستخدم نفس api client ولا تحتوي على localhost مكتوب بشكل ثابت.

20. افحص Authentication:
    - register
    - login
    - get current user
    - logout
    - JWT token
    - Authorization header

21. افحص Swap Requests:
    - إنشاء الطلب
    - قبول الطلب
    - رفض الطلب
    - جلب الطلبات

22. افحص Skills:
    - إضافة skill
    - جلب skills
    - تحديث/حذف إذا كانت موجودة

23. افحص Chat:
    - get chats
    - start chat
    - send message

24. أصلح أي import أو route أو path غير صحيح.

25. تأكد من أن Linux/production case sensitivity لن تسبب مشاكل في imports.

26. افحص package.json:
    - تأكد أن جميع dependencies المطلوبة موجودة.
    - تأكد من وجود scripts مناسبة.
    - لا تضف packages غير ضرورية.

27. شغل:
    npm install

    ثم:
    npm run build

    للـ Frontend وأصلح أي build errors.

28. شغل Backend محليًا واختبر:
    GET /api/health

    ويجب أن يرجع JSON يدل أن API يعمل.

29. لا تستخدم MongoDB localhost في Production.
    Production يجب أن يستخدم MONGO_URI الخاص بـ MongoDB Atlas.

30. إذا وجدت كودًا يستخدم MongoMemoryServer:
    اجعله للاختبارات/التطوير فقط، ولا تسمح بتشغيله في Production.

31. جهز المشروع بحيث تكون البنية واضحة مثل:

    project/
      frontend files...
      backend/
        config/
        controllers/
        middleware/
        models/
        routes/
        server.js
      api/
        index.js
      .gitignore
      .env.example
      package.json

32. إذا كان المشروع الحالي مختلفًا عن هذه البنية، لا تنقل الملفات بشكل عشوائي.
    استخدم البنية الحالية وحسّنها بأقل تغييرات ممكنة.

33. لا تحذف البيانات أو الـ models أو الـ controllers الموجودة.

34. لا تغير تصميم الـ Frontend إلا إذا كان هناك خطأ يمنع التشغيل.

35. بعد الانتهاء:
    - اعرض لي قائمة بكل الملفات التي عدلتها.
    - اشرح كل تعديل باختصار.
    - اعرض لي أي مشاكل ما زالت تحتاج Environment Variables.
    - تأكد أن المشروع جاهز لـ GitHub.

36. لا تعمل git push بنفسك.
    فقط جهز الملفات وأخبرني بالأوامر التي يجب أن أشغلها.

37. أهم شيء:
    لا تفترض أن WebSocket أو SSE موجودان.
    ابحث فعليًا في المشروع أولًا.
    ولا تحذف أي feature لمجرد جعل Vercel يعمل.

الهدف النهائي:

GitHub
  ├── Frontend
  └── Backend

Frontend → Vercel
Backend → منصة مناسبة لـ Node.js
Database → MongoDB Atlas

ويجب أن يعمل:
Register
Login
Authentication
Skills
Swap Requests
Chat
API
MongoDB

بدون localhost في Production، وبدون secrets داخل GitHub.

