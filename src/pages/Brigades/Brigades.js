import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Map from '../../components/Map/Map';
import {
  cleanBrigadeData,
  getProjectsFromBrigadeData,
  getBaseApiUrl,
  filterBrigades,
} from '../../utils';
import { ProjectsTable, Select } from '../../components';
import './Brigades.scss';

function Brigades() {
  const [brigadeData, setBrigadeData] = useState();
  const [filteredBrigadeData, setFilteredBrigadeData] = useState();
  // const [tagData, setTagData] = useState();
  const [filterOpts, setFilterOpts] = useState({});
  const { selectedBrigade, bounds } = filterOpts;
  const [projects, setProjects] = useState(
    getProjectsFromBrigadeData(filteredBrigadeData, filterOpts)
  );

  useEffect(() => {
    const getData = async () => {
      const brigades = await axios.get(`${getBaseApiUrl()}/api/data.json`);
      setBrigadeData(cleanBrigadeData(brigades));
      const tags = await axios.get(`${getBaseApiUrl()}/api/tags.json`);
      // setTagData(tags.data);
    };
    getData();
  }, []);

  useEffect(() => {
    const newlyFilteredBrigadeData = filterBrigades(brigadeData, filterOpts);
    setFilteredBrigadeData(newlyFilteredBrigadeData);
    setProjects(getProjectsFromBrigadeData(newlyFilteredBrigadeData));
  }, [brigadeData, filterOpts]);

  let brigadesShowingString = 'No brigades selected or showing on map.';
  if (filteredBrigadeData && filteredBrigadeData.length > 0) {
    brigadesShowingString = `${projects.length} projects from `;
    const firstFiveBrigades = filteredBrigadeData
      .map((b) => b.name)
      .slice(0, 5);
    if (selectedBrigade) {
      brigadesShowingString = `${brigadesShowingString} ${selectedBrigade.name}`;
    } else {
      brigadesShowingString = `${brigadesShowingString} ${firstFiveBrigades.join(
        ', '
      )}`;
    }
    if (filteredBrigadeData.length > 5) {
      brigadesShowingString = `${brigadesShowingString} and ${
        filteredBrigadeData.length - 5
      } other brigades`;
    }
  }

  return (
    <>
      {/* List projects by brigades that are shown on accompanying map */}
      {/* When map zooms or moves, re-filter geographically */}
      {/* Accessible filter by region, state, or a single brigade */}
      <h2>Projects by brigade, state, or geographic area</h2>
      <p>{brigadesShowingString}</p>
      <p>
        Zoom in on the map to filter by projects in a geographic area or{' '}
        <Select
          label="select a brigade"
          id="select-brigade"
          emptyOptionText="All brigades"
          className="display-inline-block"
          options={(brigadeData || [])
            .filter((b) => !!b.latitude && !!b.longitude)
            .map((b) => b.name)}
          selected={
            filterOpts && selectedBrigade
              ? selectedBrigade.name
              : 'All brigades'
          }
          onChange={(event) =>
            setFilterOpts(() => ({
              selectedBrigade: brigadeData.find(
                (b) => b.name === event.target.value
              ),
            }))
          }
        />
      </p>
      <div className="brigades-page-content">
        <Map
          brigadeData={brigadeData}
          filterOpts={filterOpts}
          setFilterOpts={setFilterOpts}
        />
        <ProjectsTable projects={projects} />
      </div>
    </>
  );
}

export default Brigades;
