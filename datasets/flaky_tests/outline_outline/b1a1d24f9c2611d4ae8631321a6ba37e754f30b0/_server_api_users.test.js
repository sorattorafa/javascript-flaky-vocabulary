// https://github.com/outline/outline/blob/b1a1d24f9c2611d4ae8631321a6ba37e754f30b0/server/api/users.test.js  

// blob: b1a1d24f9c2611d4ae8631321a6ba37e754f30b0 

// project_name: outline/outline 

// flaky_file: /server/api/users.test.js 

// test_affected: https://github.com/outline/outline/blob/b1a1d24f9c2611d4ae8631321a6ba37e754f30b0/server/api/users.test.js  
// start_line:  14 
// end_line:  26 
it('should return teams paginated user list', async () => {
  const { admin, user } = await seed();

  const res = await server.post('/api/users.list', {
    body: { token: admin.getJwtToken() },
  });
  const body = await res.json();

  expect(res.status).toEqual(200);
  expect(body.data.length).toEqual(2);
  expect(body.data[0].id).toEqual(user.id);
  expect(body.data[1].id).toEqual(admin.id);
});
// start_line:  28 
// end_line:  41 
it('should require admin for detailed info', async () => {
  const { user, admin } = await seed();
  const res = await server.post('/api/users.list', {
    body: { token: user.getJwtToken() },
  });
  const body = await res.json();

  expect(res.status).toEqual(200);
  expect(body.data.length).toEqual(2);
  expect(body.data[0].email).toEqual(undefined);
  expect(body.data[1].email).toEqual(undefined);
  expect(body.data[0].id).toEqual(user.id);
  expect(body.data[1].id).toEqual(admin.id);
});
