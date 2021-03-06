# List View Demo

This is a demo project that features a list view. A list view, also known as a list box, is a user interface control that allows you to select one or more items (usually lines of text) from a vertically aligned list of "list items".

If you'd prefer to run the demo without using this repo, it's available [here](https://gameplaycoder.com/article-resources/listViewDemo/)

There is also a corresponding article on my website [here](https://gameplaycoder.com/how-to-create-a-list-view-component-in-phaser-editor-v3/)

You've likely used list views many times. They are often presented in the form of a drop-down combo box, where you click on a box of text, and a list of items appears underneath, allowing you select one of them. Today, we're focusing on the actual list itself. I decided to make a test app to develop the list view component. Have a look below; it's a short clip of the demo app I've created.

![List view example](https://www.drivehq.com/file/DFPublishFile.aspx/FileID7903028575/Key7160ajlge61d/git-repo-list-view.png)

## Software Needed
To use this project, you'll need the following:

* [Node.js](https://nodejs.org/)
* [npm](http://www.npmjs.com/) (Included in the Node installation)
* [Phaser Editor 2D v3](https://phasereditor2d.com/) (You'll need a premium version if you want to full editing functionality)
* A coding editor of your choice. [VS Code](https://code.visualstudio.com/) was used on this project.
* [Texture Packer](https://www.codeandweb.com/texturepacker) Optional, but if you want to make changes to the spritesheets, you'll need this.

## Installation
Note: I'm using Windows 10 for development. Your environment may be different, and if so, you'll need to adjust these steps accordingly.
* Clone this repo.
* Open a command prompt and change to the repo's folder.
* Run the `bundle-assets` batch file. This will copy all the assets to the `.build` folder.
* Run `npm run dev`. This will start up a webpack dev server and run the list view demo.

Any time you modify the `index.html` file or anything in the `assets` folder (graphics, audio, json, etc.), run the `bundle-assets` batch to update the build folder.

That's pretty much it! Explore the list view demo and source, and feel free to play around with it.

**_- C. out._**
