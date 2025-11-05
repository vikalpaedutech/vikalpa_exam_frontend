// import React, {useState, useEffect, useContext} from "react";
// import { GetDistrictBlockSchoolByParams } from "../../services/DependentDropDownSerivces/DependentDropDownService.js";
// import Select from "react-select";
// import { UserContext } from "../NewContextApis/UserContext.js";


// import {
//   DistrictBlockSchoolDependentDropDownContext,
//   DistrictContext,
//   BlockContext,
//   SchoolContext,
//   ClassContext,
// } from "../NewContextApis/District_block_schoolsCotextApi.js";

// import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi.js";

// export const District_block_dependentDropdown = () =>{
//   const { districtBlockSchoolData = [], loadingDBS, dbsError } = useDistrictBlockSchool();


//   console.log('hello world from dependent', districtBlockSchoolData)


// }





import React, {useState, useEffect, useContext, useRef} from "react";
import { GetDistrictBlockSchoolByParams } from "../../services/DependentDropDownSerivces/DependentDropDownService.js";
import Select from "react-select";
import { UserContext } from "../NewContextApis/UserContext.js";
import { StudentContext } from "../NewContextApis/StudentContextApi.js";

import {
  DistrictBlockSchoolDependentDropDownContext,
  DistrictContext,
  BlockContext,
  SchoolContext,
  ClassContext,
} from "../NewContextApis/District_block_schoolsCotextApi.js";

import { useDistrictBlockSchool } from "../NewContextApis/District_block_schoolsCotextApi.js";





export const District_block_school_dependentDropdownMultiSelect = () =>{
  const { districtBlockSchoolData = [], loadingDBS, dbsError } = useDistrictBlockSchool();


  console.log('hello world from dependent', districtBlockSchoolData)

  // get everything from context with a single useContext call
  const ctx = useContext(DistrictBlockSchoolDependentDropDownContext) || {};
  const {
    districtContext,
    setDistrictContext,
    blockContext,
    setBlockContext,
    schoolContext,
    setSchoolContext,
  } = ctx;

  // --- Selected values stored in [{value,label}] format (multi-select)
  // initialize from context if available, otherwise empty array
  const [selectedDistricts, setSelectedDistricts] = useState(Array.isArray(districtContext) ? districtContext : []); // [{value: "1", label: "Ambala"}]
  const [selectedBlocks, setSelectedBlocks] = useState(Array.isArray(blockContext) ? blockContext : []);       // [{value: "4", label: "Naraingarh"}]
  const [selectedSchools, setSelectedSchools] = useState(Array.isArray(schoolContext) ? schoolContext : []);     // [{value: "30", label: "GMSSSS NARAINGARH"}]

  // --- Options for selects (also in {value,label} format)
  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);

  // Keep local state in sync when context changes externally
  useEffect(() => {
    if (Array.isArray(districtContext)) {
      setSelectedDistricts(districtContext);
    }
  }, [districtContext]);

  useEffect(() => {
    if (Array.isArray(blockContext)) {
      setSelectedBlocks(blockContext);
    }
  }, [blockContext]);

  useEffect(() => {
    if (Array.isArray(schoolContext)) {
      setSelectedSchools(schoolContext);
    }
  }, [schoolContext]);

  // Log context changes so you can see them in console
  useEffect(() => {
    console.log("districtContext (from provider) changed:", districtContext);
  }, [districtContext]);

  useEffect(() => {
    console.log("blockContext (from provider) changed:", blockContext);
  }, [blockContext]);

  useEffect(() => {
    console.log("schoolContext (from provider) changed:", schoolContext);
  }, [schoolContext]);

  // Build unique district options when data changes
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) {
      setDistrictOptions([]);
      return;
    }

    const map = new Map(); // districtId -> label
    districtBlockSchoolData.forEach(item => {
      if (item.districtId != null && item.districtName != null) {
        map.set(String(item.districtId), String(item.districtName));
      }
    });

    const districts = Array.from(map.entries()).map(([id, name]) => ({
      value: id,
      label: name
    }));

    setDistrictOptions(districts);
  }, [districtBlockSchoolData]);

  // Build block options; if districts selected, filter by them
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) {
      setBlockOptions([]);
      return;
    }

    // If districts selected, only include blocks whose districtId is in selectedDistricts
    const selectedDistrictIds = selectedDistricts.map(d => String(d.value));
    const map = new Map(); // blockId -> blockName

    districtBlockSchoolData.forEach(item => {
      const districtId = String(item.districtId);
      const blockId = item.blockId != null ? String(item.blockId) : null;
      const blockName = item.blockName != null ? String(item.blockName) : null;
      if (!blockId || !blockName) return;

      if (selectedDistrictIds.length === 0 || selectedDistrictIds.includes(districtId)) {
        map.set(blockId, blockName);
      }
    });

    const blocks = Array.from(map.entries()).map(([id, name]) => ({
      value: id,
      label: name
    }));

    // preserve previously selected blocks if still available, otherwise clear them
    const availableBlockIds = new Set(blocks.map(b => b.value));
    const filteredSelectedBlocks = selectedBlocks.filter(b => availableBlockIds.has(String(b.value)));

    setBlockOptions(blocks);
    if (filteredSelectedBlocks.length !== selectedBlocks.length) {
      setSelectedBlocks(filteredSelectedBlocks);
      // sync to context
      if (setBlockContext) setBlockContext(filteredSelectedBlocks);
    }
  }, [districtBlockSchoolData, selectedDistricts]); // re-run when districts change

  // Build school/center options; if blocks selected, filter by them
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) {
      setSchoolOptions([]);
      return;
    }

    const selectedBlockIds = selectedBlocks.map(b => String(b.value));
    const map = new Map(); // centerId -> centerName

    districtBlockSchoolData.forEach(item => {
      const blockId = item.blockId != null ? String(item.blockId) : null;
      const centerId = item.centerId != null ? String(item.centerId) : null;
      const centerName = item.centerName != null ? String(item.centerName) : null;
      if (!centerId || !centerName) return;

      if (selectedBlockIds.length === 0 || selectedBlockIds.includes(blockId)) {
        map.set(centerId, centerName);
      }
    });

    const centers = Array.from(map.entries()).map(([id, name]) => ({
      value: id,
      label: name
    }));

    // preserve previously selected schools if still available, otherwise clear them
    const availableCenterIds = new Set(centers.map(c => c.value));
    const filteredSelectedSchools = selectedSchools.filter(s => availableCenterIds.has(String(s.value)));

    setSchoolOptions(centers);
    if (filteredSelectedSchools.length !== selectedSchools.length) {
      setSelectedSchools(filteredSelectedSchools);
      // sync to context
      if (setSchoolContext) setSchoolContext(filteredSelectedSchools);
    }
  }, [districtBlockSchoolData, selectedBlocks]); // re-run when blocks change

  // Handlers for selection changes (react-select returns option or array of options)
  const handleDistrictChange = (options) => {
    // options will be null or array (because isMulti)
    const newSelected = Array.isArray(options) ? options : [];
    setSelectedDistricts(newSelected);

    // store to context (if setter available)
    if (setDistrictContext) {
      setDistrictContext(newSelected);
      console.log("setDistrictContext ->", newSelected);
    } else {
      console.warn("setDistrictContext not provided by Provider");
    }

    // If districts changed, clear blocks and schools (they will be re-filtered by useEffect)
    setSelectedBlocks([]);
    if (setBlockContext) setBlockContext([]);
    setSelectedSchools([]);
    if (setSchoolContext) setSchoolContext([]);
  };

  const handleBlockChange = (options) => {
    const newSelected = Array.isArray(options) ? options : [];
    setSelectedBlocks(newSelected);

    if (setBlockContext) {
      setBlockContext(newSelected);
      console.log("setBlockContext ->", newSelected);
    } else {
      console.warn("setBlockContext not provided by Provider");
    }

    // If blocks changed, clear schools
    setSelectedSchools([]);
    if (setSchoolContext) setSchoolContext([]);
  };

  const handleSchoolChange = (options) => {
    const newSelected = Array.isArray(options) ? options : [];
    setSelectedSchools(newSelected);

    if (setSchoolContext) {
      setSchoolContext(newSelected);
      console.log("setSchoolContext ->", newSelected);
    } else {
      console.warn("setSchoolContext not provided by Provider");
    }
  };

  // Example submit or usage: these states contain the selections in [{value,label}] format
  // console.log('Selected Districts:', selectedDistricts);
  // console.log('Selected Blocks:', selectedBlocks);
  // console.log('Selected Schools:', selectedSchools);

  return (
    <div>
      <h4>Dependent Dropdowns</h4>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>District</label>
        <Select
          options={districtOptions}
          value={selectedDistricts}
          onChange={handleDistrictChange}
          isMulti
          placeholder="Select district(s)..."
          closeMenuOnSelect={false}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Block</label>
        <Select
          options={blockOptions}
          value={selectedBlocks}
          onChange={handleBlockChange}
          isMulti
          placeholder="Select block(s)..."
          closeMenuOnSelect={false}
          isDisabled={blockOptions.length === 0}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>School</label>
        <Select
          options={schoolOptions}
          value={selectedSchools}
          onChange={handleSchoolChange}
          isMulti
          placeholder="Select school(s)..."
          closeMenuOnSelect={false}
          isDisabled={schoolOptions.length === 0}
        />
      </div>

      <div>
        <strong>Debug output (selected values):</strong>
        <pre style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: 8 }}>
{`selectedDistricts: ${JSON.stringify(selectedDistricts, null, 2)}
selectedBlocks: ${JSON.stringify(selectedBlocks, null, 2)}
selectedSchools: ${JSON.stringify(selectedSchools, null, 2)}`}
        </pre>
      </div>
    </div>
  );
}










// Single district block school select dependent drop down
export const District_block_school_dependentDropdown = () => {
  // single, safe useContext call (context may be undefined if Provider not present)
  const context = useContext(DistrictBlockSchoolDependentDropDownContext);
  const {
    districtContext,
    setDistrictContext,
    blockContext,
    setBlockContext,
    schoolContext,
    setSchoolContext,
  } = context || {};

  const { districtBlockSchoolData = [], loadingDBS, dbsError } =
    useDistrictBlockSchool();

  console.log("hello world from dependent", districtBlockSchoolData);

  // --- Selected values stored in {value,label} format (single select)
  // initialize from context when available
  const [selectedDistrict, setSelectedDistrict] = useState(districtContext || null);
  const [selectedBlock, setSelectedBlock] = useState(blockContext || null);
  const [selectedSchool, setSelectedSchool] = useState(schoolContext || null);

  // keep local state in sync when context changes externally
  useEffect(() => { setSelectedDistrict(districtContext || null); }, [districtContext]);
  useEffect(() => { setSelectedBlock(blockContext || null); }, [blockContext]);
  useEffect(() => { setSelectedSchool(schoolContext || null); }, [schoolContext]);

  // --- Options for selects
  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);

  // Build unique district options when data changes
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) {
      setDistrictOptions([]);
      return;
    }

    const map = new Map(); // districtId -> label
    districtBlockSchoolData.forEach((item) => {
      if (item.districtId != null && item.districtName != null) {
        map.set(String(item.districtId), String(item.districtName));
      }
    });

    const districts = Array.from(map.entries()).map(([id, name]) => ({
      value: id,
      label: name,
    }));

    setDistrictOptions(districts);
  }, [districtBlockSchoolData]);

  // Build block options; **only** when a district is selected
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) {
      setBlockOptions([]);
      return;
    }

    // If no district selected, keep blocks empty and return
    if (!selectedDistrict) {
      setBlockOptions([]);
      // Also clear any selected block/context if present
      if (selectedBlock) {
        setSelectedBlock(null);
        if (setBlockContext) setBlockContext(null);
      }
      // Clear schools as well
      setSchoolOptions([]);
      if (selectedSchool) {
        setSelectedSchool(null);
        if (setSchoolContext) setSchoolContext(null);
      }
      return;
    }

    const districtIdSelected = String(selectedDistrict.value);

    const map = new Map(); // blockId -> blockName
    districtBlockSchoolData.forEach((item) => {
      const districtId = item.districtId != null ? String(item.districtId) : null;
      const blockId = item.blockId != null ? String(item.blockId) : null;
      const blockName = item.blockName != null ? String(item.blockName) : null;
      if (!blockId || !blockName || !districtId) return;

      if (districtId === districtIdSelected) {
        map.set(blockId, blockName);
      }
    });

    const blocks = Array.from(map.entries()).map(([id, name]) => ({
      value: id,
      label: name,
    }));

    // Reset block if not valid anymore (also clear context)
    if (
      selectedBlock &&
      !blocks.find((b) => String(b.value) === String(selectedBlock.value))
    ) {
      setSelectedBlock(null);
      if (setBlockContext) setBlockContext(null);
      setSelectedSchool(null);
      if (setSchoolContext) setSchoolContext(null);
    }

    setBlockOptions(blocks);
  }, [
    districtBlockSchoolData,
    selectedDistrict,
    selectedBlock,
    selectedSchool,
    setBlockContext,
    setSchoolContext,
  ]);

  // Build school/center options; **only** when a block is selected
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) {
      setSchoolOptions([]);
      return;
    }

    // if no block selected, keep schools empty and return
    if (!selectedBlock) {
      setSchoolOptions([]);
      if (selectedSchool) {
        setSelectedSchool(null);
        if (setSchoolContext) setSchoolContext(null);
      }
      return;
    }

    const blockIdSelected = String(selectedBlock.value);

    const map = new Map(); // centerId -> centerName
    districtBlockSchoolData.forEach((item) => {
      const blockId = item.blockId != null ? String(item.blockId) : null;
      const centerId = item.centerId != null ? String(item.centerId) : null;
      const centerName = item.centerName != null ? String(item.centerName) : null;
      if (!centerId || !centerName || !blockId) return;

      if (blockId === blockIdSelected) {
        map.set(centerId, centerName);
      }
    });

    const centers = Array.from(map.entries()).map(([id, name]) => ({
      value: id,
      label: name,
    }));

    // Reset school if not valid anymore (also clear context)
    if (
      selectedSchool &&
      !centers.find((c) => String(c.value) === String(selectedSchool.value))
    ) {
      setSelectedSchool(null);
      if (setSchoolContext) setSchoolContext(null);
    }

    setSchoolOptions(centers);
  }, [
    districtBlockSchoolData,
    selectedBlock,
    selectedSchool,
    setSchoolContext,
  ]);

  // Handlers — update local state + context together. Log the actual option to avoid stale logs.
  const handleDistrictChange = (option) => {
    const newVal = option || null;
    setSelectedDistrict(newVal);
    if (setDistrictContext) setDistrictContext(newVal);

    // reset children both locally and in context
    setSelectedBlock(null);
    if (setBlockContext) setBlockContext(null);
    setSelectedSchool(null);
    if (setSchoolContext) setSchoolContext(null);

    // clear child options
    setBlockOptions([]);
    setSchoolOptions([]);

    console.log("selected district:", newVal);
  };

  const handleBlockChange = (option) => {
    const newVal = option || null;
    setSelectedBlock(newVal);
    if (setBlockContext) setBlockContext(newVal);

    // reset school locally and in context
    setSelectedSchool(null);
    if (setSchoolContext) setSchoolContext(null);

    // clear school options until effect rebuilds them for this block
    setSchoolOptions([]);

    console.log("selected block:", newVal);
  };

  const handleSchoolChange = (option) => {
    const newVal = option || null;
    setSelectedSchool(newVal);
    if (setSchoolContext) setSchoolContext(newVal);

    console.log("selected school:", newVal);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>District</label>
        <Select
          options={districtOptions}
          value={selectedDistrict}
          onChange={handleDistrictChange}
          placeholder="Select district..."
          isClearable
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Block</label>
        <Select
          options={blockOptions}
          value={selectedBlock}
          onChange={handleBlockChange}
          placeholder="Select block..."
          isClearable
          // disabled until district selected
          isDisabled={!selectedDistrict}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>School</label>
        <Select
          options={schoolOptions}
          value={selectedSchool}
          onChange={handleSchoolChange}
          placeholder="Select school..."
          isClearable
          // disabled until block selected
          isDisabled={!selectedBlock}
        />
      </div>

      {/* <div>
        <strong>Debug output (selected values):</strong>
        <pre
          style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: 8 }}
        >
{`selectedDistrict: ${JSON.stringify(selectedDistrict, null, 2)}
selectedBlock: ${JSON.stringify(selectedBlock, null, 2)}
selectedSchool: ${JSON.stringify(selectedSchool, null, 2)}`}
        </pre>
      </div> */}
    </div>
  );
};






// // //Single district block school select dependent drop down

// export const District_block_school_manual_school_name_dependentDropdown = () => {

//     //context api

// const {studentData, setStudentData} = useContext(StudentContext);

//     //____________________________________________

//     console.log(studentData)

//   // single, safe useContext call
//   const context = useContext(DistrictBlockSchoolDependentDropDownContext);
//   const {
//     districtContext,
//     setDistrictContext,
//     blockContext,
//     setBlockContext,
//     schoolContext,
//     setSchoolContext,
//   } = context || {};

//   const { districtBlockSchoolData = [], loadingDBS, dbsError } =
//     useDistrictBlockSchool();

//   // --- Selected values stored in {value,label} format (single select)
//   const [selectedDistrict, setSelectedDistrict] = useState(districtContext || null);
//   const [selectedBlock, setSelectedBlock] = useState(blockContext || null);

//   // IMPORTANT: coerce context value/label to strings so react-select can match options reliably
//   const [selectedSchool, setSelectedSchool] = useState(
//     schoolContext
//       ? { value: String(schoolContext.value), label: String(schoolContext.label) }
//       : null
//   );

//   // keep local state in sync when context changes externally
//   useEffect(() => { setSelectedDistrict(districtContext || null); }, [districtContext]);
//   useEffect(() => { setSelectedBlock(blockContext || null); }, [blockContext]);

//   // When context's school changes, coerce into {value:String,label:String}
//   useEffect(() => {
//     if (!schoolContext) {
//       setSelectedSchool(null);
//       return;
//     }
//     const coerced = {
//       value: String(schoolContext.value),
//       label: String(schoolContext.label),
//     };
//     setSelectedSchool(coerced);
//   }, [schoolContext]);

//   // --- Options for selects
//   const [districtOptions, setDistrictOptions] = useState([]);
//   const [blockOptions, setBlockOptions] = useState([]);
//   const [schoolOptions, setSchoolOptions] = useState([]);
//   // ref to read current schoolOptions inside effects without adding it to deps
//   const schoolOptionsRef = useRef(schoolOptions);
//   useEffect(() => { schoolOptionsRef.current = schoolOptions; }, [schoolOptions]);

//   // --- Manual school UI state
//   const [manualSchoolChecked, setManualSchoolChecked] = useState(false);
//   const [manualSchoolName, setManualSchoolName] = useState("");
//   const [manualSchoolCode, setManualSchoolCode] = useState("");

//   // Build unique district options when data changes
//   useEffect(() => {
//     if (!Array.isArray(districtBlockSchoolData)) {
//       setDistrictOptions([]);
//       return;
//     }
//     const map = new Map();
//     districtBlockSchoolData.forEach((item) => {
//       if (item.districtId != null && item.districtName != null) {
//         map.set(String(item.districtId), String(item.districtName));
//       }
//     });
//     const districts = Array.from(map.entries()).map(([id, name]) => ({
//       value: id,
//       label: name,
//     }));
//     setDistrictOptions(districts);
//   }, [districtBlockSchoolData]);

//   // Build block options; if a district is selected, filter by it
//   useEffect(() => {
//     if (!Array.isArray(districtBlockSchoolData)) {
//       setBlockOptions([]);
//       return;
//     }
//     const map = new Map();
//     districtBlockSchoolData.forEach((item) => {
//       const districtId = String(item.districtId);
//       const blockId = item.blockId != null ? String(item.blockId) : null;
//       const blockName = item.blockName != null ? String(item.blockName) : null;
//       if (!blockId || !blockName) return;
//       if (!selectedDistrict || selectedDistrict.value === districtId) {
//         map.set(blockId, blockName);
//       }
//     });
//     const blocks = Array.from(map.entries()).map(([id, name]) => ({ value: id, label: name }));

//     if (
//       selectedBlock &&
//       !blocks.find((b) => String(b.value) === String(selectedBlock.value))
//     ) {
//       setSelectedBlock(null);
//       if (setBlockContext) setBlockContext(null);
//       setSelectedSchool(null);
//       if (setSchoolContext) setSchoolContext(null);
//     }

//     setBlockOptions(blocks);
//   }, [districtBlockSchoolData, selectedDistrict, selectedBlock, setBlockContext, setSchoolContext]);

//   // Build school/center options; if a block is selected, filter by it
//   // NOTE: do NOT include `schoolOptions` in dependency array to avoid update loop.
//   useEffect(() => {
//     if (!Array.isArray(districtBlockSchoolData)) {
//       setSchoolOptions([]);
//       return;
//     }

//     const map = new Map();
//     districtBlockSchoolData.forEach((item) => {
//       const blockId = item.blockId != null ? String(item.blockId) : null;
//       const centerId = item.centerId != null ? String(item.centerId) : null;
//       const centerName = item.centerName != null ? String(item.centerName) : null;
//       if (!centerId || !centerName) return;
//       if (!selectedBlock || selectedBlock.value === blockId) {
//         map.set(centerId, centerName);
//       }
//     });
//     const centers = Array.from(map.entries()).map(([id, name]) => ({ value: id, label: name }));

//     // Preserve any manual entries previously added — read from ref to avoid creating a dependency loop
//     const existingManuals = (schoolOptionsRef.current || []).filter(
//       s => !centers.find(c => String(c.value) === String(s.value))
//     );
//     const merged = [...existingManuals, ...centers];

//     // Update options once
//     setSchoolOptions(merged);

//     // Only clear selectedSchool if merged truly doesn't contain it
//     if (
//       selectedSchool &&
//       !merged.find((c) => String(c.value) === String(selectedSchool.value))
//     ) {
//       setSelectedSchool(null);
//       if (setSchoolContext) setSchoolContext(null);
//     }
//     // intentionally exclude schoolOptions from deps to avoid infinite loop
//   }, [districtBlockSchoolData, selectedBlock, selectedSchool, setSchoolContext]); // eslint-disable-line react-hooks/exhaustive-deps

//   // Handlers — update local state + context together
//   const handleDistrictChange = (option) => {
//     const newVal = option || null;
//     setSelectedDistrict(newVal);
//     if (setDistrictContext) setDistrictContext(newVal);

//     setSelectedBlock(null);
//     if (setBlockContext) setBlockContext(null);
//     setSelectedSchool(null);
//     if (setSchoolContext) setSchoolContext(null);

//     setManualSchoolChecked(false);
//     setManualSchoolName("");
//     setManualSchoolCode("");

//     console.log("selected district:", newVal);
//   };

//   const handleBlockChange = (option) => {
//     const newVal = option || null;
//     setSelectedBlock(newVal);
//     if (setBlockContext) setBlockContext(newVal);

//     setSelectedSchool(null);
//     if (setSchoolContext) setSchoolContext(null);

//     setManualSchoolChecked(false);
//     setManualSchoolName("");
//     setManualSchoolCode("");

//     console.log("selected block:", newVal);
//   };

//   const handleSchoolChange = (option) => {
//     // Coerce selected option to strings so it matches schoolOptions entries
//     const newVal = option
//       ? { value: String(option.value), label: String(option.label) }
//       : null;

//     setSelectedSchool(newVal);
//     if (setSchoolContext) setSchoolContext(newVal);

//     // ensure the selected option is present in schoolOptions so react-select can render it
//     if (newVal) {
//       setSchoolOptions(prev => {
//         const exists = prev.find(s => String(s.value) === String(newVal.value));
//         if (exists) return prev;
//         return [newVal, ...prev];
//       });
//     }

//     console.log("selected school:", newVal);
//   };

//   // Manual school checkbox toggle
//   const handleManualCheck = (e) => {
//     const checked = !!e.target.checked;
//     setManualSchoolChecked(checked);

//     if (checked) {
//       // when switching to manual mode, clear any selected school from select and context
//       setSelectedSchool(null);
//       if (setSchoolContext) setSchoolContext(null);
//     } else {
//       // when leaving manual mode, clear manual inputs (keep schoolOptions)
//       setManualSchoolName("");
//       setManualSchoolCode("");
//     }
//   };

//   // Automatically add manual school when both fields are filled and checkbox is checked
//   useEffect(() => {
//     if (!manualSchoolChecked) return;
//     const name = (manualSchoolName || "").trim();
//     const code = (manualSchoolCode || "").trim();
//     if (!name || !code) return;

//     const manualOption = { value: String(code), label: String(name) };

//     // add to options if not present
//     setSchoolOptions(prev => {
//       const exists = prev.find(s => String(s.value) === String(manualOption.value));
//       if (exists) return prev;
//       return [manualOption, ...prev];
//     });

//     // set as selected and update context
//     setSelectedSchool(manualOption);
//     if (setSchoolContext) setSchoolContext(manualOption);

//     console.log("manual school auto-added & selected:", manualOption);
//   }, [manualSchoolName, manualSchoolCode, manualSchoolChecked, setSchoolContext]);

//   // --------- Styles for neat alignment ----------
//   const checkboxRowStyle = {
//     display: "flex",
//     alignItems: "flex-start",
//     gap: 8,
//     marginTop: 6,
//     marginBottom: 12,
//     width: "100%",
//     boxSizing: "border-box"
//   };
//   const checkboxBoxStyle = {
//     flex: "0 0 auto",
//     width: "50px",
//     marginTop: 3
//   };
//   const checkboxLabelWrapStyle = {
//     flex: "1 1 auto",
//     color: "#0b8b00",
//     fontWeight: 600,
//     lineHeight: 1.2,
//     fontSize: 14,
//     wordBreak: "break-word"
//   };
//   const manualCardStyle = {
//     marginBottom: 12,
//     padding: 8,
//     border: "1px solid #eee",
//     borderRadius: 6,
//     width: "100%",
//     boxSizing: "border-box"
//   };

//   return (
//     <div>
//       <div style={{ marginBottom: 16 }}>
//         <label style={{ display: "block", marginBottom: 6 }}>District</label>
//         <Select
//           options={districtOptions}
//           value={selectedDistrict}
//           onChange={handleDistrictChange}
          
//           placeholder={studentData?.schoolDistrict ?? 
//             "Select District..."
//           }
//           isClearable
//         />
//       </div>

//       <div style={{ marginBottom: 16 }}>
//         <label style={{ display: "block", marginBottom: 6 }}>Block</label>
//         <Select
//           options={blockOptions}
//           value={selectedBlock}
//           onChange={handleBlockChange}
//            placeholder={studentData?.schoolBlock ?? 
//             "Select Block..."
//           }
//           isClearable
//           isDisabled={!selectedDistrict || blockOptions.length === 0}
//         />
//       </div>

//       {/* Show Select only when manualSchoolChecked is false */}
//       {!manualSchoolChecked && (
//         <div style={{ marginBottom: 16 }}>
//           <label style={{ display: "block", marginBottom: 6 }}>School</label>
//           <Select
//             options={schoolOptions}
//             value={selectedSchool}
//             onChange={handleSchoolChange}
//               placeholder={studentData?.school ?? 
//             "Select School..."
//           }
//             isClearable
//             isDisabled={!selectedDistrict || !selectedBlock || schoolOptions.length === 0}
//           />
//         </div>
//       )}

//       {/* Checkbox row moved BELOW the School area (or where Select would be), left-aligned and sharing select width */}
//       <div style={checkboxRowStyle}>
//         <div style={checkboxBoxStyle}>
//           <input
//             id="manualSchoolCheckbox"
//             type="checkbox"
//             checked={manualSchoolChecked}
//             onChange={handleManualCheck}
//             disabled={!selectedBlock}
//           />
//         </div>

//         <div style={checkboxLabelWrapStyle}>
//           <label htmlFor="manualSchoolCheckbox" style={{ margin: 0, cursor: selectedBlock ? "pointer" : "not-allowed" }}>
//             <span style={{ color: "#0b8b00" }}>
//               If the school is not listed, please add it manually.
//             </span>
//             <div style={{ fontWeight: 400, color: "#6b6b6b", fontSize: 12, marginTop: 4 }}>
//               (यदि विद्यालय सूची में नहीं है, तो कृपया इसे मैन्युअली जोड़ें।)
//             </div>
//           </label>
//         </div>
//       </div>

//       {manualSchoolChecked && (
//         <div style={manualCardStyle}>
//           <div style={{ marginBottom: 8 }}>
//             <label style={{ display: "block", marginBottom: 6 }}>Type School Name</label>
//             <input
//               type="text"
//               value={manualSchoolName}
//               onChange={(e) => setManualSchoolName(e.target.value)}
//               placeholder="Type school name"
//               style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
//             />
//           </div>

//           <div style={{ marginBottom: 8 }}>
//             <label style={{ display: "block", marginBottom: 6 }}>Type School Code</label>
//             <input
//               type="number"
//               value={manualSchoolCode}
//               onChange={(e) => setManualSchoolCode(e.target.value)}
//               placeholder="Type school code"
//               style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
//             />
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };
















// //Single district block school select dependent drop down

export const District_block_school_manual_school_name_dependentDropdown = () => {

    //context api

const {studentData, setStudentData} = useContext(StudentContext);

    //____________________________________________

    console.log(studentData)

  // single, safe useContext call
  const context = useContext(DistrictBlockSchoolDependentDropDownContext);
  const {
    districtContext,
    setDistrictContext,
    blockContext,
    setBlockContext,
    schoolContext,
    setSchoolContext,
  } = context || {};

  const { districtBlockSchoolData = [], loadingDBS, dbsError } =
    useDistrictBlockSchool();

  // --- Selected values stored in {value,label} format (single select)
  const [selectedDistrict, setSelectedDistrict] = useState(districtContext || null);
  const [selectedBlock, setSelectedBlock] = useState(blockContext || null);

  // IMPORTANT: coerce context value/label to strings so react-select can match options reliably
  const [selectedSchool, setSelectedSchool] = useState(
    schoolContext
      ? { value: String(schoolContext.value), label: String(schoolContext.label) }
      : null
  );

  // keep local state in sync when context changes externally
  useEffect(() => { setSelectedDistrict(districtContext || null); }, [districtContext]);
  useEffect(() => { setSelectedBlock(blockContext || null); }, [blockContext]);

  // When context's school changes, coerce into {value:String,label:String}
  useEffect(() => {
    if (!schoolContext) {
      setSelectedSchool(null);
      return;
    }
    const coerced = {
      value: String(schoolContext.value),
      label: String(schoolContext.label),
    };
    setSelectedSchool(coerced);
  }, [schoolContext]);

  // --- Options for selects
  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  // ref to read current schoolOptions inside effects without adding it to deps
  const schoolOptionsRef = useRef(schoolOptions);
  useEffect(() => { schoolOptionsRef.current = schoolOptions; }, [schoolOptions]);

  // --- Manual school UI state
  const [manualSchoolChecked, setManualSchoolChecked] = useState(false);
  const [manualSchoolName, setManualSchoolName] = useState("");
  const [manualSchoolCode, setManualSchoolCode] = useState("");

  // Build unique district options when data changes
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) {
      setDistrictOptions([]);
      return;
    }
    const map = new Map();
    districtBlockSchoolData.forEach((item) => {
      if (item.districtId != null && item.districtName != null) {
        map.set(String(item.districtId), String(item.districtName));
      }
    });
    const districts = Array.from(map.entries()).map(([id, name]) => ({
      value: id,
      label: name,
    }));
    setDistrictOptions(districts);
  }, [districtBlockSchoolData]);

  // Build block options; if a district is selected, filter by it
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) {
      setBlockOptions([]);
      return;
    }
    const map = new Map();
    districtBlockSchoolData.forEach((item) => {
      const districtId = String(item.districtId);
      const blockId = item.blockId != null ? String(item.blockId) : null;
      const blockName = item.blockName != null ? String(item.blockName) : null;
      if (!blockId || !blockName) return;
      if (!selectedDistrict || selectedDistrict.value === districtId) {
        map.set(blockId, blockName);
      }
    });
    const blocks = Array.from(map.entries()).map(([id, name]) => ({ value: id, label: name }));

    if (
      selectedBlock &&
      !blocks.find((b) => String(b.value) === String(selectedBlock.value))
    ) {
      setSelectedBlock(null);
      if (setBlockContext) setBlockContext(null);
      setSelectedSchool(null);
      if (setSchoolContext) setSchoolContext(null);
    }

    setBlockOptions(blocks);
  }, [districtBlockSchoolData, selectedDistrict, selectedBlock, setBlockContext, setSchoolContext]);

  // Build school/center options; if a block is selected, filter by it
  // NOTE: do NOT include `schoolOptions` in dependency array to avoid update loop.
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) {
      setSchoolOptions([]);
      return;
    }

    const map = new Map();

    // NEW: show schools ONLY for the selected block.
    // If no block selected, produce an empty list (so UI won't show schools from other blocks).
    const blockFilter = selectedBlock ? String(selectedBlock.value) : null;

    if (!blockFilter) {
      // Clear schools if no block is selected so school select stays empty/disabled
      setSchoolOptions([]);
      // Also clear selectedSchool/context if previously set but doesn't belong to current (now-empty) list
      if (selectedSchool) {
        setSelectedSchool(null);
        if (setSchoolContext) setSchoolContext(null);
      }
      return;
    }

    districtBlockSchoolData.forEach((item) => {
      const blockId = item.blockId != null ? String(item.blockId) : null;
      const centerId = item.centerId != null ? String(item.centerId) : null;
      const centerName = item.centerName != null ? String(item.centerName) : null;
      if (!centerId || !centerName) return;

      // apply strict block filter only
      if (blockId === blockFilter) {
        map.set(centerId, centerName);
      }
    });

    const centers = Array.from(map.entries()).map(([id, name]) => ({ value: id, label: name }));

    // Preserve any manual entries previously added — read from ref to avoid creating a dependency loop
    const existingManuals = (schoolOptionsRef.current || []).filter(
      s => !centers.find(c => String(c.value) === String(s.value))
    );
    const merged = [...existingManuals, ...centers];

    // Update options once
    setSchoolOptions(merged);

    // Only clear selectedSchool if merged truly doesn't contain it
    if (
      selectedSchool &&
      !merged.find((c) => String(c.value) === String(selectedSchool.value))
    ) {
      setSelectedSchool(null);
      if (setSchoolContext) setSchoolContext(null);
    }
    // intentionally exclude schoolOptions from deps to avoid infinite loop
  }, [districtBlockSchoolData, selectedBlock, selectedSchool, setSchoolContext]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handlers — update local state + context together
  const handleDistrictChange = (option) => {
    const newVal = option || null;
    setSelectedDistrict(newVal);
    if (setDistrictContext) setDistrictContext(newVal);

    setSelectedBlock(null);
    if (setBlockContext) setBlockContext(null);
    setSelectedSchool(null);
    if (setSchoolContext) setSchoolContext(null);

    setManualSchoolChecked(false);
    setManualSchoolName("");
    setManualSchoolCode("");

    console.log("selected district:", newVal);
  };

  const handleBlockChange = (option) => {
    const newVal = option || null;
    setSelectedBlock(newVal);
    if (setBlockContext) setBlockContext(newVal);

    setSelectedSchool(null);
    if (setSchoolContext) setSchoolContext(null);

    setManualSchoolChecked(false);
    setManualSchoolName("");
    setManualSchoolCode("");

    console.log("selected block:", newVal);
  };

  const handleSchoolChange = (option) => {
    // Coerce selected option to strings so it matches schoolOptions entries
    const newVal = option
      ? { value: String(option.value), label: String(option.label) }
      : null;

    setSelectedSchool(newVal);
    if (setSchoolContext) setSchoolContext(newVal);

    // ensure the selected option is present in schoolOptions so react-select can render it
    if (newVal) {
      setSchoolOptions(prev => {
        const exists = prev.find(s => String(s.value) === String(newVal.value));
        if (exists) return prev;
        return [newVal, ...prev];
      });
    }

    console.log("selected school:", newVal);
  };

  // Manual school checkbox toggle
  const handleManualCheck = (e) => {
    const checked = !!e.target.checked;
    setManualSchoolChecked(checked);

    if (checked) {
      // when switching to manual mode, clear any selected school from select and context
      setSelectedSchool(null);
      if (setSchoolContext) setSchoolContext(null);
    } else {
      // when leaving manual mode, clear manual inputs (keep schoolOptions)
      setManualSchoolName("");
      setManualSchoolCode("");
    }
  };

  // Automatically add manual school when both fields are filled and checkbox is checked
  useEffect(() => {
    if (!manualSchoolChecked) return;
    const name = (manualSchoolName || "").trim();
    const code = (manualSchoolCode || "").trim();
    if (!name || !code) return;

    const manualOption = { value: String(code), label: String(name) };

    // add to options if not present
    setSchoolOptions(prev => {
      const exists = prev.find(s => String(s.value) === String(manualOption.value));
      if (exists) return prev;
      return [manualOption, ...prev];
    });

    // set as selected and update context
    setSelectedSchool(manualOption);
    if (setSchoolContext) setSchoolContext(manualOption);

    console.log("manual school auto-added & selected:", manualOption);
  }, [manualSchoolName, manualSchoolCode, manualSchoolChecked, setSchoolContext]);

  // --------- Styles for neat alignment ----------
  const checkboxRowStyle = {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 6,
    marginBottom: 12,
    width: "100%",
    boxSizing: "border-box"
  };
  const checkboxBoxStyle = {
    flex: "0 0 auto",
    width: "50px",
    marginTop: 3
  };
  const checkboxLabelWrapStyle = {
    flex: "1 1 auto",
    color: "#0b8b00",
    fontWeight: 600,
    lineHeight: 1.2,
    fontSize: 14,
    wordBreak: "break-word"
  };
  const manualCardStyle = {
    marginBottom: 12,
    padding: 8,
    border: "1px solid #eee",
    borderRadius: 6,
    width: "100%",
    boxSizing: "border-box"
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>School District</label>
        <Select
          options={districtOptions}
          value={selectedDistrict}
          onChange={handleDistrictChange}
          
          placeholder={studentData?.schoolDistrict ?? 
            "Select District..."
          }
          isClearable
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>School Block</label>
        <Select
          options={blockOptions}
          value={selectedBlock}
          onChange={handleBlockChange}
           placeholder={studentData?.schoolBlock ?? 
            "Select Block..."
          }
          isClearable
          isDisabled={!selectedDistrict || blockOptions.length === 0}
        />
      </div>

      {/* Show Select only when manualSchoolChecked is false */}
      {!manualSchoolChecked && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6 }}>School</label>
          <Select
            options={schoolOptions}
            value={selectedSchool}
            onChange={handleSchoolChange}
              placeholder={studentData?.school ?? 
            "Select School..."
          }
            isClearable
            isDisabled={!selectedDistrict || !selectedBlock || schoolOptions.length === 0}
          />
        </div>
      )}

      {/* Checkbox row moved BELOW the School area (or where Select would be), left-aligned and sharing select width */}
      <div style={checkboxRowStyle}>
        <div style={checkboxBoxStyle}>
          <input
            id="manualSchoolCheckbox"
            type="checkbox"
            checked={manualSchoolChecked}
            onChange={handleManualCheck}
            disabled={!selectedBlock}
          />
        </div>

        <div style={checkboxLabelWrapStyle}>
          <label htmlFor="manualSchoolCheckbox" style={{ margin: 0, cursor: selectedBlock ? "pointer" : "not-allowed" }}>
            <span style={{ color: "#0b8b00" }}>
              If the school is not listed, please add it manually.
            </span>
            <div style={{ fontWeight: 400, color: "#6b6b6b", fontSize: 12, marginTop: 4 }}>
              (यदि विद्यालय सूची में नहीं है, तो कृप्या इसे मैन्युअली जोड़ें।)
            </div>
          </label>
        </div>
      </div>

      {manualSchoolChecked && (
        <div style={manualCardStyle}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Type School Name</label>
            <input
              type="text"
              value={manualSchoolName}
              onChange={(e) => setManualSchoolName(e.target.value)}
              placeholder="Type school name"
              style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Type School Code</label>
            <input
              type="number"
              value={manualSchoolCode}
              onChange={(e) => setManualSchoolCode(e.target.value)}
              placeholder="Type school code"
              style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
            />
          </div>
        </div>
      )}

    </div>
  );
};





//District_school dependent drop down


export const District_school_dependentDropdown = () => {

  // safe single useContext call
  const ctx = useContext(DistrictBlockSchoolDependentDropDownContext) || {};
  const {
    districtContext,
    setDistrictContext,
    blockContext,
    setBlockContext,
    schoolContext,
    setSchoolContext,
  } = ctx;

  const { districtBlockSchoolData = [], loadingDBS, dbsError } =
    useDistrictBlockSchool();

  console.log("hello world from dependent", districtBlockSchoolData);

  // --- Selected values stored in {value,label} format (single select)
  const [selectedDistrict, setSelectedDistrict] = useState(districtContext || null);
  const [selectedBlock, setSelectedBlock] = useState(blockContext || null);
  const [selectedSchool, setSelectedSchool] = useState(schoolContext || null);

  // sync local state when context changes externally
  useEffect(() => { setSelectedDistrict(districtContext || null); }, [districtContext]);
  useEffect(() => { setSelectedBlock(blockContext || null); }, [blockContext]);
  useEffect(() => { setSelectedSchool(schoolContext || null); }, [schoolContext]);

  // --- Options for selects
  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);

  // Build unique district options when data changes
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) {
      setDistrictOptions([]);
      return;
    }

    const map = new Map(); // districtId -> label
    districtBlockSchoolData.forEach((item) => {
      if (item.districtId != null && item.districtName != null) {
        map.set(String(item.districtId), String(item.districtName));
      }
    });

    const districts = Array.from(map.entries()).map(([id, name]) => ({
      value: id,
      label: name,
    }));

    setDistrictOptions(districts);
  }, [districtBlockSchoolData]);

  // Build block options; if a district is selected, filter by it
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) {
      setBlockOptions([]);
      return;
    }

    const map = new Map(); // blockId -> blockName
    districtBlockSchoolData.forEach((item) => {
      const districtId = String(item.districtId);
      const blockId = item.blockId != null ? String(item.blockId) : null;
      const blockName = item.blockName != null ? String(item.blockName) : null;
      if (!blockId || !blockName) return;

      // include blocks only for the selected district (or all if none selected)
      if (!selectedDistrict || selectedDistrict.value === districtId) {
        map.set(blockId, blockName);
      }
    });

    const blocks = Array.from(map.entries()).map(([id, name]) => ({
      value: id,
      label: name,
    }));

    // If the previously selected block is no longer valid, clear local + context
    if (
      selectedBlock &&
      !blocks.find((b) => String(b.value) === String(selectedBlock.value))
    ) {
      setSelectedBlock(null);
      if (setBlockContext) setBlockContext(null);

      // also clear school since block changed/invalid
      setSelectedSchool(null);
      if (setSchoolContext) setSchoolContext(null);
    }

    setBlockOptions(blocks);
  }, [districtBlockSchoolData, selectedDistrict, selectedBlock, setBlockContext, setSchoolContext]);

  // Build school/center options; if a block is selected, filter by it
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) {
      setSchoolOptions([]);
      return;
    }

    const map = new Map(); // centerId -> centerName
    districtBlockSchoolData.forEach((item) => {
      const blockId = item.blockId != null ? String(item.blockId) : null;
      const centerId = item.centerId != null ? String(item.centerId) : null;
      const centerName =
        item.centerName != null ? String(item.centerName) : null;
      if (!centerId || !centerName) return;

      // include centers only for the selected block (or all if no block selected)
      if (!selectedBlock || selectedBlock.value === blockId) {
        map.set(centerId, centerName);
      }
    });

    const centers = Array.from(map.entries()).map(([id, name]) => ({
      value: id,
      label: name,
    }));

    // If previously selected school is no longer present, clear local + context
    if (
      selectedSchool &&
      !centers.find((c) => String(c.value) === String(selectedSchool.value))
    ) {
      setSelectedSchool(null);
      if (setSchoolContext) setSchoolContext(null);
    }

    setSchoolOptions(centers);
  }, [districtBlockSchoolData, selectedBlock, selectedSchool, setSchoolContext]);

  // Handlers — update local state + context together
  const handleDistrictChange = (option) => {
    const newVal = option || null;
    setSelectedDistrict(newVal);
    if (setDistrictContext) setDistrictContext(newVal);

    // reset children both locally and in context
    setSelectedBlock(null);
    if (setBlockContext) setBlockContext(null);
    setSelectedSchool(null);
    if (setSchoolContext) setSchoolContext(null);

    console.log("selected district:", newVal);
  };

  const handleBlockChange = (option) => {
    const newVal = option || null;
    setSelectedBlock(newVal);
    if (setBlockContext) setBlockContext(newVal);

    // clear school when block changes
    setSelectedSchool(null);
    if (setSchoolContext) setSchoolContext(null);

    console.log("selected block:", newVal);
  };

  const handleSchoolChange = (option) => {
    const newVal = option || null;
    setSelectedSchool(newVal);
    if (setSchoolContext) setSchoolContext(newVal);

    console.log("selected school:", newVal);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>District</label>
        <Select
          options={districtOptions}
          value={selectedDistrict}
          onChange={handleDistrictChange}
          placeholder="Select district..."
          isClearable
        />
      </div>
{/* 
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Block</label>
        <Select
          options={blockOptions}
          value={selectedBlock}
          onChange={handleBlockChange}
          placeholder="Select block..."
          isClearable
          isDisabled={blockOptions.length === 0}
        />
      </div> */}

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>School</label>
        <Select
          options={schoolOptions}
          value={selectedSchool}
          onChange={handleSchoolChange}
          placeholder="Select school..."
          isClearable
          /* school disabled until district selected (explicit requirement) */
          isDisabled={!selectedDistrict || schoolOptions.length === 0}
        />
      </div>

      <div>
        <strong>Debug output (selected values):</strong>
        <pre
          style={{ whiteSpace: "pre-wrap", background: "#f5f5f5", padding: 8 }}
        >
{`selectedDistrict: ${JSON.stringify(selectedDistrict, null, 2)}
selectedBlock: ${JSON.stringify(selectedBlock, null, 2)}
selectedSchool: ${JSON.stringify(selectedSchool, null, 2)}`}
        </pre>
      </div>
    </div>
  );
};






//District_block dependent drop down

export const District_block_dependentDropdown = () => {
  const ctx = useContext(DistrictBlockSchoolDependentDropDownContext) || {};
  const { districtContext, setDistrictContext, blockContext, setBlockContext } = ctx;

  const { districtBlockSchoolData = [] } = useDistrictBlockSchool();

  // local state (single-select)
  const [selectedDistrict, setSelectedDistrict] = useState(districtContext || null);
  const [selectedBlock, setSelectedBlock] = useState(blockContext || null);

  // options
  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);

  // sync local state when context changes externally
  useEffect(() => { setSelectedDistrict(districtContext || null); }, [districtContext]);
  useEffect(() => { setSelectedBlock(blockContext || null); }, [blockContext]);

  // build district options
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) return setDistrictOptions([]);
    const map = new Map();
    districtBlockSchoolData.forEach(item => {
      if (item.districtId != null && item.districtName != null) {
        map.set(String(item.districtId), String(item.districtName));
      }
    });
    setDistrictOptions(Array.from(map.entries()).map(([v, l]) => ({ value: v, label: l })));
  }, [districtBlockSchoolData]);

  // build block options filtered by selectedDistrict
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) return setBlockOptions([]);
    const map = new Map();
    districtBlockSchoolData.forEach(item => {
      const districtId = String(item.districtId);
      const blockId = item.blockId != null ? String(item.blockId) : null;
      const blockName = item.blockName != null ? String(item.blockName) : null;
      if (!blockId || !blockName) return;
      if (!selectedDistrict || selectedDistrict.value === districtId) {
        map.set(blockId, blockName);
      }
    });
    const blocks = Array.from(map.entries()).map(([v, l]) => ({ value: v, label: l }));

    // if selected block no longer valid -> clear local + context
    if (selectedBlock && !blocks.find(b => String(b.value) === String(selectedBlock.value))) {
      setSelectedBlock(null);
      if (setBlockContext) setBlockContext(null);
    }

    setBlockOptions(blocks);
  }, [districtBlockSchoolData, selectedDistrict, selectedBlock, setBlockContext]);

  // handlers
  const handleDistrictChange = (opt) => {
    const newVal = opt || null;
    setSelectedDistrict(newVal);
    if (setDistrictContext) setDistrictContext(newVal);
    // reset block
    setSelectedBlock(null);
    if (setBlockContext) setBlockContext(null);
    console.log("setDistrictContext ->", newVal);
  };

  const handleBlockChange = (opt) => {
    const newVal = opt || null;
    setSelectedBlock(newVal);
    if (setBlockContext) setBlockContext(newVal);
    console.log("setBlockContext ->", newVal);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>District</label>
        <Select
          options={districtOptions}
          value={selectedDistrict}
          onChange={handleDistrictChange}
          placeholder="Select district..."
          isClearable
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Block</label>
        <Select
          options={blockOptions}
          value={selectedBlock}
          onChange={handleBlockChange}
          placeholder="Select block..."
          isClearable
          /* block disabled until district selected */
          isDisabled={!selectedDistrict || blockOptions.length === 0}
        />
      </div>

      <div>
        <strong>Debug:</strong>
        <pre style={{ background: "#f5f5f5", padding: 8 }}>
{`selectedDistrict: ${JSON.stringify(selectedDistrict, null, 2)}
selectedBlock: ${JSON.stringify(selectedBlock, null, 2)}`}
        </pre>
      </div>
    </div>
  );
};






//block_school_dependent drop down


export const Block_school_dependentDropdown = () => {
  const ctx = useContext(DistrictBlockSchoolDependentDropDownContext) || {};
  const { blockContext, setBlockContext, schoolContext, setSchoolContext } = ctx;

  const { districtBlockSchoolData = [] } = useDistrictBlockSchool();

  // local state
  const [selectedBlock, setSelectedBlock] = useState(blockContext || null);
  const [selectedSchool, setSelectedSchool] = useState(schoolContext || null);

  // options
  const [blockOptions, setBlockOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);

  // sync local state on context change
  useEffect(() => { setSelectedBlock(blockContext || null); }, [blockContext]);
  useEffect(() => { setSelectedSchool(schoolContext || null); }, [schoolContext]);

  // build all block options from data
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) return setBlockOptions([]);
    const map = new Map();
    districtBlockSchoolData.forEach(item => {
      const blockId = item.blockId != null ? String(item.blockId) : null;
      const blockName = item.blockName != null ? String(item.blockName) : null;
      if (!blockId || !blockName) return;
      map.set(blockId, blockName);
    });
    setBlockOptions(Array.from(map.entries()).map(([v, l]) => ({ value: v, label: l })));
  }, [districtBlockSchoolData]);

  // build school options filtered by selectedBlock
  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) return setSchoolOptions([]);
    const map = new Map();
    districtBlockSchoolData.forEach(item => {
      const blockId = item.blockId != null ? String(item.blockId) : null;
      const centerId = item.centerId != null ? String(item.centerId) : null;
      const centerName = item.centerName != null ? String(item.centerName) : null;
      if (!blockId || !centerId || !centerName) return;
      if (!selectedBlock || selectedBlock.value === blockId) {
        map.set(centerId, centerName);
      }
    });
    const centers = Array.from(map.entries()).map(([v,l]) => ({ value: v, label: l }));

    if (selectedSchool && !centers.find(c => String(c.value) === String(selectedSchool.value))) {
      setSelectedSchool(null);
      if (setSchoolContext) setSchoolContext(null);
    }

    setSchoolOptions(centers);
  }, [districtBlockSchoolData, selectedBlock, selectedSchool, setSchoolContext]);

  // handlers
  const handleBlockChange = (opt) => {
    const newVal = opt || null;
    setSelectedBlock(newVal);
    if (setBlockContext) setBlockContext(newVal);

    // reset school
    setSelectedSchool(null);
    if (setSchoolContext) setSchoolContext(null);
    console.log("setBlockContext ->", newVal);
  };

  const handleSchoolChange = (opt) => {
    const newVal = opt || null;
    setSelectedSchool(newVal);
    if (setSchoolContext) setSchoolContext(newVal);
    console.log("setSchoolContext ->", newVal);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Block</label>
        <Select
          options={blockOptions}
          value={selectedBlock}
          onChange={handleBlockChange}
          placeholder="Select block..."
          isClearable
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>School</label>
        <Select
          options={schoolOptions}
          value={selectedSchool}
          onChange={handleSchoolChange}
          placeholder="Select school..."
          isClearable
          /* school disabled until block selected */
          isDisabled={!selectedBlock || schoolOptions.length === 0}
        />
      </div>

      <div>
        <strong>Debug:</strong>
        <pre style={{ background: "#f5f5f5", padding: 8 }}>
{`selectedBlock: ${JSON.stringify(selectedBlock, null, 2)}
selectedSchool: ${JSON.stringify(selectedSchool, null, 2)}`}
        </pre>
      </div>
    </div>
  );
};





//District drop down


export const District_dropdown = () => {
  const ctx = useContext(DistrictBlockSchoolDependentDropDownContext) || {};
  const { districtContext, setDistrictContext } = ctx;

  const { districtBlockSchoolData = [] } = useDistrictBlockSchool();

  const [selectedDistrict, setSelectedDistrict] = useState(districtContext || null);
  const [districtOptions, setDistrictOptions] = useState([]);

  useEffect(() => { setSelectedDistrict(districtContext || null); }, [districtContext]);

  useEffect(() => {
    if (!Array.isArray(districtBlockSchoolData)) return setDistrictOptions([]);
    const map = new Map();
    districtBlockSchoolData.forEach(item => {
      if (item.districtId != null && item.districtName != null) {
        map.set(String(item.districtId), String(item.districtName));
      }
    });
    setDistrictOptions(Array.from(map.entries()).map(([v,l]) => ({ value: v, label: l })));
  }, [districtBlockSchoolData]);

  const handleDistrictChange = (opt) => {
    const newVal = opt || null;
    setSelectedDistrict(newVal);
    if (setDistrictContext) setDistrictContext(newVal);
    console.log("setDistrictContext ->", newVal);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 6 }}>District</label>
        <Select
          options={districtOptions}
          value={selectedDistrict}
          onChange={handleDistrictChange}
          placeholder="Select district..."
          isClearable
        />
      </div>

      <div>
        <strong>Debug:</strong>
        <pre style={{ background: "#f5f5f5", padding: 8 }}>
{`selectedDistrict: ${JSON.stringify(selectedDistrict, null, 2)}`}
        </pre>
      </div>
    </div>
  );
};