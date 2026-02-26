if (!process.env.ADMIN_INVITE_TOKEN) {
  process.env.ADMIN_INVITE_TOKEN = "smoke-admin-token";
}

const mongoose = require("mongoose");
const app = require("../src/app");
const connectDatabase = require("../src/config/db");

const request = async (base, path, method = "GET", body, token) => {
  const headers = {};
  if (body) {
    headers["content-type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch (_err) {
    data = text;
  }

  return { status: response.status, data };
};

const run = async () => {
  await connectDatabase();

  const server = app.listen(0, async () => {
    const base = `http://127.0.0.1:${server.address().port}/api/v1`;
    const suffix = Date.now();

    try {
      const adminEmail = `admin${suffix}@example.com`;
      const userEmail = `user${suffix}@example.com`;

      const adminRegister = await request(base, "/auth/register", "POST", {
        name: "Smoke Admin",
        email: adminEmail,
        password: "Password123",
        role: "admin",
        adminInviteToken: process.env.ADMIN_INVITE_TOKEN,
      });
      const userRegister = await request(base, "/auth/register", "POST", {
        name: "Smoke User",
        email: userEmail,
        password: "Password123",
        role: "user",
      });
      const adminLogin = await request(base, "/auth/login", "POST", {
        email: adminEmail,
        password: "Password123",
      });
      const userLogin = await request(base, "/auth/login", "POST", {
        email: userEmail,
        password: "Password123",
      });

      const adminToken = adminLogin.data?.data?.token;
      const userToken = userLogin.data?.data?.token;

      const createTask = await request(
        base,
        "/tasks",
        "POST",
        {
          title: "Smoke task",
          description: "Task created by smoke test",
          priority: "high",
        },
        userToken
      );

      const taskId = createTask.data?.data?._id;

      const adminStats = await request(base, "/admin/stats", "GET", null, adminToken);
      const userStats = await request(base, "/admin/stats", "GET", null, userToken);
      const deleteTask = await request(
        base,
        `/tasks/${taskId}`,
        "DELETE",
        null,
        userToken
      );

      const result = {
        adminRegister: adminRegister.status,
        userRegister: userRegister.status,
        adminLogin: adminLogin.status,
        userLogin: userLogin.status,
        createTask: createTask.status,
        adminStats: adminStats.status,
        userStats: userStats.status,
        deleteTask: deleteTask.status,
      };

      // eslint-disable-next-line no-console
      console.log(JSON.stringify(result, null, 2));

      const allPassed =
        result.adminRegister === 201 &&
        result.userRegister === 201 &&
        result.adminLogin === 200 &&
        result.userLogin === 200 &&
        result.createTask === 201 &&
        result.adminStats === 200 &&
        result.userStats === 403 &&
        result.deleteTask === 200;

      process.exitCode = allPassed ? 0 : 1;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      process.exitCode = 1;
    } finally {
      server.close(async () => {
        await mongoose.disconnect();
        process.exit(process.exitCode || 0);
      });
    }
  });
};

run().catch(async (error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});

