# Hidden Message Encoder

This is a static website project that allows you to encode a hidden message within a visible one. The hidden message is encoded using octal representation and randomly inserted into the visible message using eight invisible characters. When the encoded message is pasted elsewhere, the hidden message remains concealed. The concept and logic of this project were inspired by [Traube](https://github.com/Traubi1000101/).

## Features
* Encode a hidden message within a visible one
* Randomly insert the hidden message using invisible characters
* Encoded message remains hidden when pasted elsewhere

## Usage
1. Clone the repository to your local machine.
2. Open the `index.html` file in a web browser.
3. Enter the visible message in the provided input field.
4. Enter the hidden message in the corresponding input field.
5. Encoded message will appear after leaving the input field.
6. The encoded message will be displayed, with the hidden message randomly inserted using invisible characters.
7. Copy the encoded message and paste it elsewhere to share the visible message without revealing the hidden one.

## Example
### Input:
Visible message: "Hello, how are you?"
Hidden message: "Secret message"

### Output:
Encoded message: "Hel⁡⁤⁢⁣⁡⁤​‌⁡⁤​⁣⁡⁤‍⁢⁡⁤​‌⁡⁤‍​⁡​⁠⁡⁤‌‌⁡⁤​‌⁡⁤‍⁣⁡⁤‍⁣⁡⁤​⁤⁡⁤​﻿⁡⁤​‌lo, how are you?"

## Note
Please keep in mind that this encoding method is not designed for secure communication or encryption purposes. It is merely a demonstration of hiding a message within another message using basic techniques.

## License
This project is licensed under the MIT License.