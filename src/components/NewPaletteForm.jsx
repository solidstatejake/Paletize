import React, { Component } from 'react';
import { ChromePicker } from 'react-color';
import chroma from 'chroma-js';
import NavBar from "./NavBar";
import Drawer from "./Drawer";
import UserColorBox from "./UserColorBox";
import fs from 'fs';

class NewPaletteForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      displayDrawerContents: false,
      currentPaletteName: '',
      currentPaletteIdName: '',
      currentPaletteEmoji: '',
      currentColor: this.randomizeColor(true),
      colorsInUserPalette: []
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.clearPalette = this.clearPalette.bind(this);
    this.handleColorPickerChange = this.handleColorPickerChange.bind(this);
    this.handleColorNameChange = this.handleColorNameChange.bind(this);
    this.handlePaletteNameChange = this.handlePaletteNameChange.bind(this);
    this.randomizeColor = this.randomizeColor.bind(this);
    this.handleCreateNewPalette = this.handleCreateNewPalette.bind(this);
  }

  toggleDrawer() {
    this.setState({ displayDrawerContents: !this.state.displayDrawerContents })
  }

  clearPalette() {
    this.setState({ colors: [] }, () => console.log('force update'));
  }

  handleColorPickerChange(color) {
    const name = this.state.currentColor.name;
    this.setState({
      currentColor: {
        hex: color.hex,
        name
      }
    });
  }

  handleColorNameChange(event) {
    this.setState({
      currentColor: {
        ...this.state.currentColor,
        name: event.target.value
      }
    })
  }

  handlePaletteNameChange(event) {
    this.setState({currentPaletteName: event.target.value})
  }

  addColor(newColor) {
    const { colorsInUserPalette, currentColor } = this.state;

    // Validate color name length
    if (currentColor.name.length < 3) {
      return alert('Color must have a name of at least three characters.');
    }

    // Validate color name uniquity
    for (let color of colorsInUserPalette) {
      if (color.name === newColor.name) return alert('Color name must be unique.');
    }

    this.setState({
      colorsInUserPalette: [ ...colorsInUserPalette, newColor ],
      currentColor: {
        ...currentColor,
        name: ''
      }
    })
  }

  randomizeColor(calledInConstructor = false) {
    const randomColorHEX = chroma.random();
    const randomColorRGBA = randomColorHEX.rgba();
    const currentColor = {
      hex: randomColorHEX.hex(),
      name: calledInConstructor ? '' : this.state.currentColor.name
    };

    if (calledInConstructor) {
      return currentColor;
    } else {
      this.setState({ currentColor })
    }
  }

  handleCreateNewPalette() {

    const { currentPaletteName, colorsInUserPalette } = this.state;
    const currentPaletteIdName = currentPaletteName.toLowerCase().replace(' ', '-');

    const newPalette = {
      paletteName: currentPaletteName,
      id: currentPaletteIdName,
      emoji: '',
      colors: colorsInUserPalette
    };

    this.props.createNewPalette(newPalette);
  }

  render() {
    const { currentColor, colorsInUserPalette, currentPaletteName, displayDrawerContents } = this.state;
    return (
      <div className='NewPaletteForm'>
        <NavBar/>
        <div className="NewPaletteForm__body--container">

          <Drawer
            toggleDrawer={ this.toggleDrawer }
            displayDrawerContents={ displayDrawerContents }
          >
            <button
              className="NewPaletteForm__button--delete-palette"
              onClick={ this.clearPalette }
            >
              Clear Palette
            </button>

            <ChromePicker
              color={ currentColor.hex }
              onChangeComplete={ this.handleColorPickerChange }
            />

            <div className="NewPaletteForm__button--container">
              <input className='NewPaletteForm__input--text' type="text"
                     placeholder='Color Name' value={ currentColor.name }
                     onChange={ this.handleColorNameChange }
              />
              <input className='NewPaletteForm__input--text' type="text"
                     placeholder='Palette Name' value={ currentPaletteName }
                     onChange={ this.handlePaletteNameChange }
              />
              <button className="NewPaletteForm__button"
                      onClick={ () => this.addColor(currentColor) }
              >Add Color
              </button>

              <button className="NewPaletteForm__button"
                      onClick={ () => this.randomizeColor(false) }
              >Randomize Color
              </button>

              <button className="NewPaletteForm__button--create-palette"
                      onClick={this.handleCreateNewPalette}
              >Create Palette
              </button>
            </div>

          </Drawer>

          <div className="NewPaletteForm__colors">
            { colorsInUserPalette.map((color) => {
              return <UserColorBox
                key={ color.name }
                id={ color.name }
                background={ color.hex }
                name={ color.name }
              />
            }) }
          </div>
        </div>

      </div>
    );
  }
}

export default NewPaletteForm;