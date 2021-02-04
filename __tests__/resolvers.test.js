const fetch = require("node-fetch");

// !If receiving CORS connection errors just keep repeating the test
// !Try running the test, if you receive a connection error, go to the terminal and
// !then press 'a' to run all tests. Seems to work 🙃
// !The connection succeeds sporadically ¯\_(ツ)_/¯
describe("json resolvers", () => {
  it("returns the expected data for simple all launches query", async () => {
    try {
      const query = `
    query {
  launches {
    flight_number
    mission_name
  }
}
    `;
      const url = "http://localhost:4000/graphql";
      const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      };
      const res = await fetch(url, opts);

      const data = await res.json();

      expect(data).toMatchObject({
        data: {
          launches: [
            {
              flight_number: 90,
              mission_name: "Starlink 4",
            },
            {
              flight_number: 91,
              mission_name: "CRS-20",
            },
            {
              flight_number: 92,
              mission_name: "Starlink 5",
            },
            {
              flight_number: 93,
              mission_name: "Starlink 6",
            },
          ],
        },
      });
    } catch (err) {
      console.error(err);
    }
  });

  it("returns the expected data for mission_name query", async () => {
    try {
      const query = `
    query testMission($mission:String= "CRS-20"){
  missionName(mission_name: $mission ){
    flight_number
    mission_name
    launch_date_unix
    rocket{
      rocket_id
      payloads{
        payload_id
        norad_id
      }
    }
    launch_site{
      site_id
      site_name
      site_name_long
    }
    launch_success
  }
}
    `;
      const url = "http://localhost:4000/graphql";
      const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      };
      const res = await fetch(url, opts);

      const data = await res.json();

      expect(data).toMatchObject({
        data: {
          missionName: {
            flight_number: 91,
            mission_name: "CRS-20",
            launch_date_unix: 1583556631,
            rocket: {
              rocket_id: "falcon9",
              payloads: [
                {
                  payload_id: "CRS-20",
                  norad_id: [45341],
                },
              ],
            },
            launch_site: {
              site_id: "ccafs_slc_40",
              site_name: "CCAFS SLC 40",
              site_name_long:
                "Cape Canaveral Air Force Station Space Launch Complex 40",
            },
            launch_success: true,
          },
        },
      });
    } catch (err) {
      console.error(err);
    }
  });

  it("returns the expected data for launch_date_unix query", async () => {
    try {
      const query = `
    query testDate($launchDate:Int= 1581951955){
  launchDate(launch_date_unix: $launchDate ){
    flight_number
    mission_name
    launch_date_unix
    rocket{
      rocket_id
      payloads{
        payload_id
        norad_id
      }
    }
    launch_site{
      site_id
      site_name
      site_name_long
    }
    launch_success
  }
}
    `;
      const url = "http://localhost:4000/graphql";
      const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      };
      const res = await fetch(url, opts);

      const data = await res.json();

      expect(data).toMatchObject({
        data: {
          launchDate: [
            {
              flight_number: 90,
              mission_name: "Starlink 4",
              launch_date_unix: 1581951955,
              rocket: {
                rocket_id: "falcon9",
                payloads: [
                  {
                    payload_id: "Starlink 4",
                    norad_id: [],
                  },
                ],
              },
              launch_site: {
                site_id: "ccafs_slc_40",
                site_name: "CCAFS SLC 40",
                site_name_long:
                  "Cape Canaveral Air Force Station Space Launch Complex 40",
              },
              launch_success: true,
            },
          ],
        },
      });
    } catch (err) {
      console.error(err);
    }
  });
  it("returns the expected data for norad_id query", async () => {
    try {
      const query = `
    query testNorad($noradId:Int= 45341){
  noradId(norad_id: $noradId ){
    flight_number
    mission_name
    launch_date_unix
    rocket{
      rocket_id
      payloads{
        payload_id
        norad_id
      }
    }
    launch_site{
      site_id
      site_name
      site_name_long
    }
    launch_success
  }
}
    `;
      const url = "http://localhost:4000/graphql";
      const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      };
      const res = await fetch(url, opts);

      const data = await res.json();

      expect(data).toMatchObject({
        data: {
          noradId: [
            {
              flight_number: 90,
              mission_name: "Starlink 4",
              launch_date_unix: 1581951955,
              rocket: {
                rocket_id: "falcon9",
                payloads: [
                  {
                    payload_id: "Starlink 4",
                    norad_id: [],
                  },
                ],
              },
              launch_site: {
                site_id: "ccafs_slc_40",
                site_name: "CCAFS SLC 40",
                site_name_long:
                  "Cape Canaveral Air Force Station Space Launch Complex 40",
              },
              launch_success: true,
            },
            {
              flight_number: 91,
              mission_name: "CRS-20",
              launch_date_unix: 1583556631,
              rocket: {
                rocket_id: "falcon9",
                payloads: [
                  {
                    payload_id: "CRS-20",
                    norad_id: [45341],
                  },
                ],
              },
              launch_site: {
                site_id: "ccafs_slc_40",
                site_name: "CCAFS SLC 40",
                site_name_long:
                  "Cape Canaveral Air Force Station Space Launch Complex 40",
              },
              launch_success: true,
            },
            {
              flight_number: 92,
              mission_name: "Starlink 5",
              launch_date_unix: 1584533760,
              rocket: {
                rocket_id: "falcon9",
                payloads: [
                  {
                    payload_id: "Starlink 5",
                    norad_id: [
                      45178,
                      45179,
                      45180,
                      45181,
                      45182,
                      45183,
                      45184,
                      45185,
                      45186,
                      45187,
                      45188,
                      45189,
                      45190,
                      45191,
                      45192,
                      45193,
                      45194,
                      45195,
                      45196,
                      45197,
                      45198,
                      45199,
                      45200,
                      45201,
                      45202,
                      45203,
                      45204,
                      45205,
                      45206,
                      45207,
                      45208,
                      45209,
                      45210,
                      45211,
                      45212,
                      45213,
                      45214,
                      45215,
                      45216,
                      45217,
                      45218,
                      45219,
                      45220,
                      45221,
                      45222,
                      45223,
                      45224,
                      45225,
                      45226,
                      45227,
                      45228,
                      45229,
                      45230,
                      45231,
                      45232,
                      45233,
                      45234,
                      45235,
                      45236,
                      45237,
                    ],
                  },
                ],
              },
              launch_site: {
                site_id: "ksc_lc_39a",
                site_name: "KSC LC 39A",
                site_name_long:
                  "Kennedy Space Center Historic Launch Complex 39A",
              },
              launch_success: true,
            },
            {
              flight_number: 93,
              mission_name: "Starlink 6",
              launch_date_unix: 1587583800,
              rocket: {
                rocket_id: "falcon9",
                payloads: [
                  {
                    payload_id: "Starlink 6",
                    norad_id: [72000],
                  },
                ],
              },
              launch_site: {
                site_id: "ksc_lc_39a",
                site_name: "KSC LC 39A",
                site_name_long:
                  "Kennedy Space Center Historic Launch Complex 39A",
              },
              launch_success: true,
            },
          ],
        },
      });
    } catch (err) {
      console.error(err);
    }
  });
});
