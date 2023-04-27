


  	    const fontFileInput = document.getElementById('font-file');
  	    const fontSelect = document.getElementById('font-select');
  	    const editableText = document.getElementById('editable-text');
  	    const fontSizeSlider = document.getElementById('font-size-slider');
  	    const fontSizeValue = document.getElementById('font-size-value');
  	    const lineHeightSlider = document.getElementById('line-height-slider');
  	    const lineHeightValue = document.getElementById('line-height-value');
  	    const letterSpacingSlider = document.getElementById('letter-spacing-slider');
  	    const letterSpacingValue = document.getElementById('letter-spacing-value');
  

    function wrapIndividualChars(styleProp, value) {
      const selectedText = window.getSelection();
      if (selectedText && selectedText.rangeCount) {
        const range = selectedText.getRangeAt(0);
        const newContent = range.extractContents();
        const textNodes = getTextNodes(newContent);

        textNodes.forEach(textNode => {
          const span = document.createElement('span');
          span.style[styleProp] = value;
          span.textContent = textNode.textContent;
          textNode.parentNode.replaceChild(span, textNode);
        });

        range.insertNode(newContent);
        selectedText.removeAllRanges();
        selectedText.addRange(range);
      }
    }

    function getTextNodes(node) {
      let textNodes = [];

      if (node.nodeType === Node.TEXT_NODE) {
        textNodes.push(node);
      } else {
        node.childNodes.forEach(child => {
          textNodes = textNodes.concat(getTextNodes(child));
        });
      }

      return textNodes;
    }

	fontFileInput.addEventListener('change', (e) => {
	  const file = e.target.files[0];
	  if (file) {
	    const reader = new FileReader();
	    reader.readAsArrayBuffer(file);
	    reader.onload = () => {
	      const fontBlob = new Blob([reader.result], { type: file.type });
	      const fontURL = URL.createObjectURL(fontBlob);
	      const fontName = file.name.split('.')[0];
	      const customFont = new FontFace(fontName, `url(${fontURL})`);
	      customFont.load().then((font) => {
	        document.fonts.add(font);
	        const option = document.createElement('option');
	        option.value = fontName;
	        option.textContent = fontName;
			option.setAttribute('data-font-url', fontURL);
	        fontSelect.appendChild(option);

	        // Set the fontSelect value to "Default" after the new font is loaded
	        fontSelect.value = 'default';
	      });
	    };
	  }
	});
  


    fontSizeSlider.addEventListener('input', (e) => {
      const fontSize = e.target.value;
      wrapIndividualChars('fontSize', `${fontSize}px`);
      fontSizeValue.textContent = fontSize;
    });
  
  
    lineHeightSlider.addEventListener('input', (e) => {
        const lineHeight = e.target.value;
        const selectedText = window.getSelection();
        if (selectedText && selectedText.rangeCount) {
          const range = selectedText.getRangeAt(0).cloneRange();
          const newContent = range.extractContents();
          const paragraphs = Array.from(newContent.childNodes).filter(node => node.nodeName === 'P');

          paragraphs.forEach(paragraph => {
            const div = document.createElement('div');
            div.style.lineHeight = lineHeight;
            paragraph.parentNode.replaceChild(div, paragraph);
            div.appendChild(paragraph);
          });

          range.insertNode(newContent);
          selectedText.removeAllRanges();
          selectedText.addRange(range);
        }
        lineHeightValue.textContent = lineHeight;
      });
  

    letterSpacingSlider.addEventListener('input', (e) => {
      const letterSpacing = e.target.value;
      wrapIndividualChars('letterSpacing', `${letterSpacing}px`);
      letterSpacingValue.textContent = letterSpacing;
    });

      fontSelect.addEventListener('change', () => {
        wrapIndividualChars('fontFamily', fontSelect.value === 'default' ? 'inherit' : fontSelect.value);
      });

  	function updateLineHeight() {
  	      editableText.style.lineHeight = lineHeightSlider.value;
  	      lineHeightValue.textContent = lineHeightSlider.value;
  	    }

  	    fontSizeSlider.addEventListener('input', (e) => {
  	      const fontSize = e.target.value;
  	      wrapIndividualChars('fontSize', `${fontSize}px`);
  	      fontSizeValue.textContent = fontSize;
  	    });

  	    lineHeightSlider.addEventListener('input', (e) => {
  	      updateLineHeight();
  	    });

  	    letterSpacingSlider.addEventListener('input', (e) => {
  	      const letterSpacing = e.target.value;
  	      wrapIndividualChars('letterSpacing', `${letterSpacing}px`);
  	      letterSpacingValue.textContent = letterSpacing;
  	    });

  		const writingDirectionRadios = document.getElementsByName('writing-direction');
  		writingDirectionRadios.forEach((radio) => {
  		  radio.addEventListener('change', (e) => {
  		    const direction = e.target.value;
  		    if (direction === 'vertical') {
  		      editableText.style.writingMode = 'vertical-rl';
  		      editableText.style.direction = 'ltr';
  		    } else {
  		      editableText.style.direction = direction;
  		      editableText.style.writingMode = 'horizontal-tb';
  		    }
  		  });
  		});


		// Function to create and display feature toggle buttons
		// Function to create and display feature toggle buttons
		function displayFeatureButtons(features) {
		  const featureContainer = document.getElementById('feature-container');
		  featureContainer.innerHTML = '';

		  const uniqueFeatureTags = Array.from(new Set(features.map(f => f.tag)));

		  // Define the group of feature tags
		  const groupedFeatures = [
		    'lnum', 'tnum', 'onum', 'pnum',
		    'sups', 'tosf', 'subs', 'sinf',
		    'numr', 'dnom'
		  ];

		  uniqueFeatureTags.forEach(tag => {
		    if (tag !== 'aalt' && tag !== 'ccmp' && tag !== 'locl') {
		      const button = document.createElement('button');
		      button.textContent = `OFF: ${tag}`;
		      button.dataset.state = 'off';
		      button.classList.add('feature-toggle');

		      button.addEventListener('click', () => {
		        const currentState = button.dataset.state;

		        if (currentState === 'on') {
		          button.dataset.state = 'off';
		          button.textContent = `OFF: ${tag}`;
		        } else if (currentState === 'off' || currentState === 'mixed') {
		          button.dataset.state = 'on';
		          button.textContent = `ON: ${tag}`;

		          // If the clicked feature is part of the group, disable other features in the group
		          if (groupedFeatures.includes(tag)) {
		            const otherGroupedFeatures = groupedFeatures.filter(feature => feature !== tag);
		            otherGroupedFeatures.forEach(feature => {
		              const otherFeatureButton = featureContainer.querySelector(`button[data-tag="${feature}"]`);
		              if (otherFeatureButton) {
		                otherFeatureButton.dataset.state = 'off';
		                otherFeatureButton.textContent = `OFF: ${feature}`;
		              }
		            });
		          }
		        }

		        // Call updateOpenTypeFeatures to apply the active OpenType features
		        updateOpenTypeFeatures();
		      });

		      button.setAttribute('data-tag', tag); // Set the data-tag attribute to store the feature tag
		      featureContainer.appendChild(button);
		    }
		  });
		}
		
		
		
		
		
		
		// Function to update the OpenType features for the selected text
		// Function to update the OpenType features for the selected text
		function updateOpenTypeFeatures() {
		  const featureToggles = document.querySelectorAll('.feature-toggle');
		  const activeFeatures = [];

		  // Get the active features
		  featureToggles.forEach(toggle => {
		    if (toggle.dataset.state === 'on') {
		      activeFeatures.push(toggle.textContent.split(': ')[1]);
		    }
		  });

		  const selectedText = window.getSelection();
		  if (selectedText && selectedText.rangeCount) {
		    const range = selectedText.getRangeAt(0).cloneRange();
		    const newContent = range.extractContents();
		    const textNodes = getTextNodes(newContent);

		    textNodes.forEach(textNode => {
		      const span = document.createElement('span');
		      if (activeFeatures.length > 0) {
		        span.style.fontFeatureSettings = activeFeatures.map(feature => `"${feature}" 1`).join(', ');
		      } else {
		        span.style.fontFeatureSettings = 'normal';
		      }
		      span.textContent = textNode.textContent;
		      textNode.parentNode.replaceChild(span, textNode);
		    });

		    range.insertNode(newContent);
		    selectedText.removeAllRanges();
		    selectedText.addRange(range);
		  }
		}
		
		
		
		
		// Update the fontSelect event listener
		fontSelect.addEventListener('change', () => {
		  
		  if (fontSelect.value !== 'default') {
		    // Retrieve the font URL from the selected option
		    const selectedOption = fontSelect.options[fontSelect.selectedIndex];
		    const fontURL = selectedOption.getAttribute('data-font-url');

		    // Load the font using opentype.js
		    opentype.load(fontURL, (err, font) => {
		      if (err) {
		        console.error('Error loading font:', err);
		        return;
		      }

		      // Set the postScriptName as the font family
		      editableText.style.fontFamily = font.names.postScriptName;

		      // Get the OpenType features
		      const features = font.tables.gsub.features;

		      // Display the feature toggle buttons
		      displayFeatureButtons(features);
		    });
		  } else {
		    const featureList = document.getElementById('feature-list');
		    featureList.innerHTML = '';
		  }
		});
