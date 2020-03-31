/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect, useRef } from 'react';
import '../styles.scss';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import HighlightOff from '@material-ui/icons/HighlightOff';
import { useParams } from 'react-router';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import AddModal from './addModal';
import DeleteModal from './DeleteModal';

const Compost = () => {
  const [state, setState] = useState({ information: {}, list: [], users: {} });
  const [newInputs, setNewInputs] = useState([{ itemName: '', user: '' }]);
  const [grabData, setGrabData] = useState(false);
  const [changedRows, setChangedRows] = useState({});
  const [addedRows, setAddedRows] = useState([]);
  const [showAddModal, toggleAddModal] = useState(false);
  const [showDeleteModal, toggleDeleteModal] = useState(false);
  const [checked, setChecked] = useState([]);

  const { id } = useParams();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetch(`/api/${id}`)
      .then(res => res.json())
      .then(data => {
        // console.log('this is data from use effect', data);
        // console.log('this is addedRows', addedRows);
        document.title = 'Compost | ' + data.information.title;
        setState(data);
        scrollToBottom();
      })
      .catch(err => {
        console.log(err);
        return window.location.replace('/');
      });
  }, [grabData]);

  const menuItem = [];
  const list = [];

  for (const i in state.users) {
    menuItem.push(
      <MenuItem value={state.users[i].id}>{state.users[i].name}</MenuItem>,
    );
  }
  const handleTextEdit = (event, row) => {
    event.persist();
    const newChangedRow = Object.assign({}, changedRows);
    newChangedRow[row] = true;
    setChangedRows(newChangedRow);
    setState(oldState => {
      const list = oldState.list.slice();
      list[row] = {
        ...list[row],
        itemName: event.target.value,
      };
      return {
        ...oldState,
        list,
      };
    });
  };

  const handleUserEdit = (event, row) => {
    event.persist();
    const newChangedRow = Object.assign({}, changedRows);
    newChangedRow[row] = true;
    setChangedRows(newChangedRow);
    setState(oldState => {
      const list = oldState.list.slice();
      list[row] = {
        ...list[row],
        user: event.target.value,
      };
      return {
        ...oldState,
        list,
      };
    });
  };

  const deleteItem = id => {
    id = {
      id,
    };

    fetch('/api/items', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(id),
    })
      .then(res => res.json())
      .then(data => {
        //close modal
        setGrabData(!grabData);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const deleteNew = e => {
    // console.log(addedRows);
    const position = e[`id`].slice(9);
    // if (!position) setAddedRows(addedRows.shift());
    // else if (position.length !== 1 && position === position.length - 1) setAddedRows(addedRows.pop());
    const thing = [...newInputs];
    //  if (!position) setNewInputs(thing.shift());
    //  else if (position.length !== 1 && position === position.length - 1) setNewInputs(thing.pop());
    //  else {
    thing.splice(position, 1);
    // console.log("thing", thing);
    setNewInputs(thing);
    //  }
  };

  for (const i in state.list) {
    // console.log(i);
    list.push(
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '1vh',
        }}
        className="itemRow"
      >
        <div>
          <HighlightOff
            key={`Delete ${i}`}
            id={`delete${i}item`}
            style={{ position: 'relative', top: '2vh', right: '1vw' }}
            onClick={() => {
              deleteItem(state.list[i].id);
            }}
            variant="outlined"
          />
          <TextField
            style={{ width: '70vh', paddingRight: '5vw' }}
            id={`row${i}item`}
            variant="outlined"
            // defaultValue={state.list[i].itemName}
            value={state.list[i].itemName}
            onChange={e => handleTextEdit(e, i)}
            inputProps={{
              itemID: state.list[i].id,
            }}
          />
          <FormControl style={{ marginTop: '6px' }}>
            <InputLabel>Name</InputLabel>
            <Select
              style={{ width: '30vh' }}
              defaultValue={state.list[i].user}
              inputProps={{
                id: `row${i}user`,
              }}
              onChange={e => handleUserEdit(e, i)}
            >
              {menuItem}
            </Select>
          </FormControl>
        </div>
      </div>,
    );
  }

  const row = length => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '1vh',
      }}
      className="itemRow"
    >
      <div>
        <HighlightOff
          key={`Delete ${length}`}
          id={`deletenew${length}`}
          style={{ position: 'relative', top: '2vh', right: '1vw' }}
          onClick={e => {
            deleteNew(e.target);
          }}
          variant="outlined"
        />
        <TextField
          style={{ width: '70vh', paddingRight: '5vw' }}
          id={`newRow${newInputs.length}item`}
          variant="outlined"
          placeholder="New Item"
          value={newInputs[length].itemName}
          onChange={e => {
            e.persist();
            setNewInputs(newInputs => {
              const newInputsCopy = newInputs.slice();
              newInputsCopy[length] = {
                ...newInputsCopy[length],
                itemName: e.target.value,
              };
              return newInputsCopy;
            });
            if (e.target.value.length === 1) {
              setNewInputs(newInput => [
                ...newInput,
                { itemName: '', user: '' },
              ]);
              const newRows = Object.assign({}, addedRows);
              newRows[newInputs.length - 1] = true;
              setAddedRows(newRows);
            }
          }}
          inputProps={{
            id: `newRow${length}item`,
          }}
        />
      </div>
      <FormControl>
        <InputLabel>Name</InputLabel>
        <Select
          style={{ width: '30vh' }}
          inputProps={{
            id: 'newRow' + length + 'user',
          }}
          value={newInputs[length].user}
          onChange={e => {
            e.persist();
            setNewInputs(newInputs => {
              const newInputsCopy = newInputs.slice();
              newInputsCopy[length] = {
                ...newInputsCopy[length],
                user: e.target.value,
              };
              return newInputsCopy;
            });
          }}
        >
          {menuItem}
        </Select>
      </FormControl>
    </div>
  );
  const newInputComponents = [];
  for (let i = 0; i < newInputs.length; i++) {
    newInputComponents.push(row(i));
  }

  const handleSubmit = event => {
    event.preventDefault();
    // to keep track of updated items
    const updatedItems = [];
    for (let i in changedRows) {
      updatedItems.push({
        id: event.target[`row${i}item`].getAttribute('itemID'),
        user: event.target[`row${i}user`].value,
        name: event.target[`row${i}item`].value,
      });
    }
    // to keep track of newly added items;
    const newItems = [];
    for (const i in addedRows) {
      newItems.push({
        user: Number(event.target[`newRow${i}user`].value),
        name: event.target[`newRow${i}item`].value,
      });
    }
    // add fetch here
    // console.log('new items', newItems);
    // console.log('updated items', updatedItems);
    fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updatedItems,
        newItems,
        location: id,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setGrabData(!grabData);
        setNewInputs([{ itemName: '', user: '' }]);
        setAddedRows([]);
        setChangedRows({});
      });
  };
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '30vh',
            paddingBottom: '10px',
          }}
        >
          <Typography variant="h1" component="h2">
            <b>{state.information.title}</b>
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {state.information.brief}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {state.information.date}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {state.information.location_title}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {state.information.location}
          </Typography>
          <div
            style={{
              display: 'flex',
            }}
          >
            <div style={{ marginRight: '10px' }}>
              <Button
                onClick={() => {
                  toggleAddModal(true);
                }}
                variant="contained"
                color="primary"
              >
                add user
              </Button>
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                toggleDeleteModal(true);
              }}
            >
              delete user
            </Button>
          </div>
        </div>
        <hr style={{ width: '80%' }} />
        <form
          style={{ display: 'flex', flexDirection: 'column' }}
          onSubmit={handleSubmit}
        >
          <div className="scroll" style={{ height: '62vh', overflow: 'auto' }}>
            {list}
            {newInputComponents}
            <div ref={messagesEndRef} />
          </div>
          <Button variant="contained" type="submit" color="primary">
            Save Changes
          </Button>
        </form>
      </div>
      <DeleteModal
        show={showDeleteModal}
        toggleDeleteModal={toggleDeleteModal}
        users={state.users}
        grabData={grabData}
        setGrabData={setGrabData}
        checked={checked}
        setChecked={setChecked}
      />
      <AddModal
        show={showAddModal}
        toggleAddModal={toggleAddModal}
        page={id}
        setGrabData={setGrabData}
        grabData={grabData}
      />
    </>
  );
};

export default Compost;
