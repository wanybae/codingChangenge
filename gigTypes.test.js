import cc from './gagTypes';

test('gigTypes', () => {
  const sampleData1 = [
    {
      "name": "Wany",
      "age": 40,
      "address": {
        "line1": "111-10, kill",
        "line2": "sdlfkjsaldkfj",
        "city": "Goyang-si",
        "state": "KG"
      }
    },
    {
      "name": "Greg",
      "age": 36,
      "address": {
        "line1": "19, Meadowlake Drive",
        "city": "Downingtown",
        "state": "PA"
      }
    },
    {
      "name": "Dano",
      "age": 34,
      "address": {
        "line2": "18, Meadowlake Drive",
        "city": "Eldorado",
        "state": "CA"
      }
    }
  ];
  const sampleData2 = [
    {
      name: "Wany",
      job: {
        employer: "Abbot",
        position: "First base",
        roomNumber: 9,
      },
      next: {
        name: "Greg",
        middleName: "Micheal",
        job: {
          employer: "Abbot",
          position: "Second base",
          roomNumber: 55,
        },
        next: {
          name: "Dano",
          middleName: "Micheal",
          job: {
            employer: "Free agent",
            position: "First base",
            email: "ddaannoo@gmail.com",
            roomNumber: 17,
          },
        }
      }
    },
    {
      name: "Wany",
      job: {
        employer: "Abbot",
        position: "First base",
        roomNumber: 83,
      },
      next: {
        name: "Greg",
        middleName: "Micheal",
        job: {
          employer: "Abbot",
          position: "Second base",
          roomNumber: 43,
        },
        next: {
          name: "Dano",
          middleName: "Micheal",
          job: {
            employer: "Free agent",
            position: "First base",
            roomNumber: 26,
          },
        },
      },
    },
  ];
  cc.gigTypes(
    JSON.stringify(sampleData1),
    "rootArrayElement"
  );
  cc.gigTypes(
    JSON.stringify(sampleData2),
    "next"
  );
  // expect(cc.gigTypes(
  //   JSON.stringify(sampleData2),
  //   "next"
  // )).toMatchObject(sampleData2);
});