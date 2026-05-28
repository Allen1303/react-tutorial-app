export const CURRICULUM = [
  {
    id: "jsx_power",
    title: "Chapter 1: The Power of JSX",
    lessons: [
      {
        id: "welcome_react",
        title: "1.1 Welcome to React!",
        slug: "welcome-react",
        description: `### What is React?
React is a popular JavaScript library created by Facebook for building fast, interactive user interfaces. 

At the heart of React is **JSX (JavaScript XML)**, which lets you write HTML-like markup directly inside your JavaScript file. 

Instead of writing tedious document selection and creation commands:
\`\`\`javascript
const el = document.createElement("p");
el.innerText = "Hello";
document.body.appendChild(el);
\`\`\`

In React, you simply write:
\`\`\`jsx
return <p>Hello</p>;
\`\`\`

### Your First Challenge
Modify the returned paragraph tag inside the \`App\` component so that it says **"Hello World from React!"** instead of the current message.`,
        initialCode: `export default function App() {
  return (
    <p>Change this to say 'Hello World from React!'</p>
  );
}`,
        solutionCode: `export default function App() {
  return (
    <p>Hello World from React!</p>
  );
}`,
        hint: "Locate the `<p>` tag and edit the text between `<p>` and `</p>` to exactly match `'Hello World from React!'` (case-sensitive!).",
        requirements: [
          {
            id: "renders_p",
            text: "Must render a paragraph (<p>) tag",
            test: ({ container }) => {
              const p = container.querySelector("p");
              if (!p) throw new Error("Could not find a <p> tag.");
              return true;
            },
          },
          {
            id: "correct_para_text",
            text: "Paragraph text must match exactly 'Hello World from React!'",
            test: ({ container }) => {
              const p = container.querySelector("p");
              if (!p) throw new Error("Could not find a <p> tag.");
              const txt = p.textContent?.trim();
              if (txt !== "Hello World from React!") {
                throw new Error(
                  `Expected text to be "Hello World from React!" but found "${txt}"`,
                );
              }
              return true;
            },
          },
        ],
      },
      {
        id: "jsx_expressions",
        title: "1.2 Dynamics with Expressions",
        slug: "jsx-expressions",
        description: `### JSX Expressions
With standard HTML, templates are static. In React, you can bring your templates to life by executing **JavaScript expressions** directly inside your markup using curly braces \`{}\`.

You can place variables, math expressions, string operations, or functions inside the curly braces, and React will evaluate them and render the result:
\`\`\`jsx
const score = 100;
return <p>Your score is: {score}</p>;
\`\`\`

### Your Challenge
We have declared a constant \`username\` equal to \`"Curious Coder"\`. 
Update the \`<h1>\` heading element to dynamically output the username so that it welcomes them as **"Welcome, Curious Coder"**.`,
        initialCode: `export default function App() {
  const username = "Curious Coder";
  
  return (
    <h1 className="text-xl font-bold">
      Welcome, USER_GOES_HERE
    </h1>
  );
}`,
        solutionCode: `export default function App() {
  const username = "Curious Coder";
  
  return (
    <h1 className="text-xl font-bold">
      Welcome, {username}
    </h1>
  );
}`,
        hint: "Replace the raw text 'USER_GOES_HERE' with `{username}` to bind the variable value dynamically.",
        requirements: [
          {
            id: "renders_h1",
            text: "Must render an <h1> heading",
            test: ({ container }) => {
              const h1 = container.querySelector("h1");
              if (!h1) throw new Error("Could not find an <h1> tag.");
              return true;
            },
          },
          {
            id: "renders_variable",
            text: "Heading displays 'Welcome, Curious Coder'",
            test: ({ container }) => {
              const h1 = container.querySelector("h1");
              if (!h1) throw new Error("Could not find an <h1> tag.");
              const txt = h1.textContent?.trim();
              if (txt !== "Welcome, Curious Coder") {
                throw new Error(
                  `Expected heading text to be "Welcome, Curious Coder" but found "${txt}"`,
                );
              }
              return true;
            },
          },
        ],
      },
      {
        id: "react_fragments",
        title: "1.3 React Fragments",
        slug: "react-fragments",
        description: `### Why Fragments?
In React, a component must return **a single parent element**. If you return multiple sibling elements without a parent, React will throw a parsing error:
\`\`\`jsx
// ❌ THIS WILL FAIL TO COMPILE!
return (
  <h1>Header</h1>
  <p>Detail</p>
);
\`\`\`

Often, developers solve this by wrapping everything inside a redundant \`<div>\`. However, this pollutes the DOM with useless wrapping containers.

### The Fragment Solution
React provides **Fragments** (\`<>\` and \`</>\`) - a special component that allows wrapping sibling children without creating parent nodes in the browser's DOM:
\`\`\`jsx
// ✅ THIS COMPILES CLEANLY!
return (
  <>
    <h1>Header</h1>
    <p>Detail</p>
  </>
);
\`\`\`

### Your Challenge
Modify the \`App\` component's JSX layout. Currently, it has a redundant, outer \`<div>\` element. 
Replace that outer \`<div>\` and its closing tag with a **React Fragment** (\`<>\` and \`</>\`) so that both heading and description render directly at the root.`,
        initialCode: `export default function App() {
  return (
    <div className="redundant-container">
      <h1 className="text-xl font-bold">Concept Review</h1>
      <p className="text-sm text-gray-600">Avoid extra markup nesting.</p>
    </div>
  );
}`,
        solutionCode: `export default function App() {
  return (
    <>
      <h1 className="text-xl font-bold">Concept Review</h1>
      <p className="text-sm text-gray-600">Avoid extra markup nesting.</p>
    </>
  );
}`,
        hint: 'Replace `<div className="redundant-container">` with `<>` and the closing `</div>` with `</>`.',
        requirements: [
          {
            id: "no_outer_div",
            text: "No outer <div> wrapper present in the rendered markup",
            test: ({ container }) => {
              const rootChildren = Array.from(container.children);
              if (
                rootChildren.length === 1 &&
                rootChildren[0].tagName === "DIV"
              ) {
                throw new Error(
                  "Found a wrapping <div> at the root of your component. Replace it with a flat React Fragment!",
                );
              }
              return true;
            },
          },
          {
            id: "keeps_siblings",
            text: "Renders both the <h1> and <p> elements at the root level",
            test: ({ container }) => {
              const h1 = container.querySelector("h1");
              const p = container.querySelector("p");
              if (!h1 || !p)
                throw new Error(
                  "Make sure to keep both the <h1> heading and the <p> description unchanged inside.",
                );
              return true;
            },
          },
        ],
      },
      {
        id: "jsx_style_attribute",
        title: "1.4 Dynamic Attribute Styling",
        slug: "jsx-style-attribute",
        description: `### Inline Style Attribute in React
In HTML, style attributes are written as raw strings: \`style="color: red;"\`.

In React, styled layouts are passed as a **JavaScript object** instead. Property names are written in **camelCase** (e.g. \`backgroundColor\` instead of \`background-color\`):
\`\`\`jsx
return (
  <span style={{ color: "blue", fontSize: "14px" }}>
    Styled Text
  </span>
);
\`\`\`
*(Tip: The outer curly braces \`{}\` tell JSX we are evaluating Javascript, and the inner braces \`{}\` declare the style object itself!)*

### Your Challenge
Update the heading \`<h1>\` to have an inline green text style by setting the style color property directly to **\`"rgb(16, 185, 129)"\`**.`,
        initialCode: `export default function App() {
  return (
    <h1 style={{ /* Enter custom styles here */ }} className="text-2xl font-bold">
      Styled Heading
    </h1>
  );
}`,
        solutionCode: `export default function App() {
  return (
    <h1 style={{ color: "rgb(16, 185, 129)" }} className="text-2xl font-bold">
      Styled Heading
    </h1>
  );
}`,
        hint: 'Add `color: "rgb(16, 185, 129)"` inside the double curly-braces attribute.',
        requirements: [
          {
            id: "renders_styled_h1",
            text: "Renders an <h1> heading",
            test: ({ container }) => {
              const h1 = container.querySelector("h1");
              if (!h1) throw new Error("Could not find an <h1> tag.");
              return true;
            },
          },
          {
            id: "style_is_green",
            text: "The style has text color set to 'rgb(16, 185, 129)'",
            test: ({ container }) => {
              const h1 = container.querySelector("h1");
              if (!h1) throw new Error("Could not find an <h1> tag.");
              if (h1.style.color !== "rgb(16, 185, 129)") {
                throw new Error(
                  `Expected text color to be 'rgb(16, 185, 129)' but found '${h1.style.color}'`,
                );
              }
              return true;
            },
          },
        ],
      },
    ],
  },
  {
    id: "components_props",
    title: "Chapter 2: Components & Props",
    lessons: [
      {
        id: "create_component",
        title: "2.1 Your First Component",
        slug: "create-component",
        description: `### What is a Component?
React components are the building blocks of application user interfaces. They are standard JavaScript functions that return JSX, conforming to two critical rules:
1. **Capital Letter Naming**: Their function name MUST start with a capital letter (e.g., \`WelcomeMessage\`, NOT \`welcomeMessage\`). This allows React to differentiate between custom components and default HTML tags.
2. **Returns Markup**: They return JSX elements representing a portion of the system.

You can then render your new custom element inside other components just like a custom HTML tag! For example:
\`\`\`jsx
function Alert() {
  return <p>Alert!</p>;
}

export default function App() {
  return (
    <div>
      <Alert />
    </div>
  );
}
\`\`\`

### Your Challenge
1. Create a custom component named \`WelcomeMessage\` that returns a paragraph tag \`<p>\` with the exact text: **"Welcome to React Tutorial!"**
2. Render your new \`<WelcomeMessage />\` component inside the returned \`<main>\` tag of the \`App\` component.`,
        initialCode: `// 1. Define your custom WelcomeMessage component here


export default function App() {
  return (
    <main className="p-4 border border-dashed rounded-lg">
      {/* 2. Render WelcomeMessage inside this container */}
      
    </main>
  );
}`,
        solutionCode: `function WelcomeMessage() {
  return <p>Welcome to React Tutorial!</p>;
}

export default function App() {
  return (
    <main className="p-4 border border-dashed rounded-lg">
      <WelcomeMessage />
    </main>
  );
}`,
        hint: "Declare `function WelcomeMessage() { return <p>Welcome to React Tutorial!</p>; }` above the App component and put `<WelcomeMessage />` inside `<main>...</main>`.",
        requirements: [
          {
            id: "has_main",
            text: "Renders the outer <main> markup",
            test: ({ container }) => {
              const main = container.querySelector("main");
              if (!main) throw new Error("Could not find the <main> element.");
              return true;
            },
          },
          {
            id: "renders_message",
            text: "WelcomeMessage component outputs 'Welcome to React Tutorial!'",
            test: ({ container }) => {
              const main = container.querySelector("main");
              const p = main?.querySelector("p");
              if (!p)
                throw new Error(
                  "Could not find any `<p>` tag inside `<main>`. Did you render your custom component?",
                );
              if (p.textContent?.trim() !== "Welcome to React Tutorial!") {
                throw new Error(
                  `Expected text to be "Welcome to React Tutorial!" but found "${p.textContent?.trim()}"`,
                );
              }
              return true;
            },
          },
        ],
      },
      {
        id: "passing_props",
        title: "2.2 Passing Props",
        slug: "passing-props",
        description: `### Component Inputs: Props
If components were fully static, we could not reuse them easily. React uses **Props (Properties)** to pass arguments into functional components, similar to parameters passed to functions or attributes passed to HTML tags.

React packages all incoming properties into a single JavaScript object called \`props\` and passes it as the first argument:
\`\`\`jsx
function Greeting(props) {
  return <p>Hi, {props.name}!</p>;
}

// Rendering components with different props:
<Greeting name="Alice" /> // renders: Hi, Alice!
<Greeting name="Bob" />   // renders: Hi, Bob!
\`\`\`

### Your Challenge
The \`Button\` component receives a list of parameters through \`props\`. 
Update the \`Button\` component implementation to display the **\`props.label\`** value inside the button tag instead of the hardcoded word "Click".`,
        initialCode: `function Button(props) {
  return (
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium">
      Click
    </button>
  );
}

export default function App() {
  return (
    <div className="p-4 text-center">
      <Button label="Save Changes" />
    </div>
  );
}`,
        solutionCode: `function Button(props) {
  return (
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium">
      {props.label}
    </button>
  );
}

export default function App() {
  return (
    <div className="p-4 text-center">
      <Button label="Save Changes" />
    </div>
  );
}`,
        hint: "Replace the word 'Click' between the button tags with `{props.label}`.",
        requirements: [
          {
            id: "has_btn",
            text: "Renders the <button> tag",
            test: ({ container }) => {
              const btn = container.querySelector("button");
              if (!btn) throw new Error("Could not find a <button> element.");
              return true;
            },
          },
          {
            id: "correct_label",
            text: "Displays the dynamic 'Save Changes' label successfully",
            test: ({ container }) => {
              const btn = container.querySelector("button");
              if (btn?.textContent?.trim() !== "Save Changes") {
                throw new Error(
                  `Expected 'Save Changes' but found '${btn?.textContent?.trim()}'`,
                );
              }
              return true;
            },
          },
        ],
      },
      {
        id: "prop_destructuring",
        title: "2.3 Destructuring Props",
        slug: "prop-destructuring",
        description: `### Destructuring Parameters
Instead of writing \`props.name\` and \`props.role\` constantly, JavaScript developers often use **object destructuring** directly inside the component's function parameters list!

This makes code cleaner, highly readable, and lists component requirements right in the function signature:
\`\`\`jsx
// Instead of: function User(props) { ... props.name }
// We can write:
function User({ name, age }) {
  return <p>{name} is {age} years old.</p>;
}
\`\`\`

### Your Challenge
Update the \`UserCard\` component to destructure **\`name\`** and **\`role\`** directly inside the argument parenthesis. 
Then display those values inside the respective \`<h2>\` and \`<p>\` elements.`,
        initialCode: `function UserCard(props) {
  return (
    <div className="p-4 border rounded shadow-sm bg-white max-w-xs">
      <h2 className="text-lg font-bold text-gray-800">
        User: {/* Output name instead of props.name */}
      </h2>
      <p className="text-sm text-gray-500">
        Role: {/* Output role instead of props.role */}
      </p>
    </div>
  );
}

export default function App() {
  return <UserCard name="Alex" role="Lead Instructor" />;
}`,
        solutionCode: `function UserCard({ name, role }) {
  return (
    <div className="p-4 border rounded shadow-sm bg-white max-w-xs">
      <h2 className="text-lg font-bold text-gray-800">
        User: {name}
      </h2>
      <p className="text-sm text-gray-500">
        Role: {role}
      </p>
    </div>
  );
}

export default function App() {
  return <UserCard name="Alex" role="Lead Instructor" />;
}`,
        hint: "Change `UserCard(props)` to `UserCard({ name, role })` and bind names as `{name}` and `{role}` inside the markup.",
        requirements: [
          {
            id: "correct_card_name",
            text: "Heading includes destruction name 'User: Alex'",
            test: ({ container }) => {
              const h2 = container.querySelector("h2");
              if (!h2) throw new Error("Could not find an <h2> elements");
              if (h2.textContent?.trim() !== "User: Alex") {
                throw new Error(
                  `Expected text to be 'User: Alex' but found '${h2.textContent?.trim()}'`,
                );
              }
              return true;
            },
          },
          {
            id: "correct_card_role",
            text: "Paragraph includes destructured role 'Role: Lead Instructor'",
            test: ({ container }) => {
              const p = container.querySelector("p");
              if (!p) throw new Error("Could not find a <p> elements");
              if (p.textContent?.trim() !== "Role: Lead Instructor") {
                throw new Error(
                  `Expected text 'Role: Lead Instructor' but found '${p.textContent?.trim()}'`,
                );
              }
              return true;
            },
          },
        ],
      },
      {
        id: "default_props",
        title: "2.4 Default Parameters",
        slug: "default-props",
        description: `### Fallbacks: Default Props
Sometimes props are optional. In standard Javascript, we specify **default parameter values** to provide fallback states if the caller fails to pass a prop value:
\`\`\`jsx
function Badge({ variant = "info" }) {
  return <span className={variant}>Badge</span>;
}
\`\`\`
If \\\`<Badge />\\\` is rendered with no properties, variant will default gracefully to \`"info"\`.

### Your Challenge
Update the \`TextBox\` component to accept parameters \`placeholder\` with a default value of **\`"Enter text here..."\`**. Display that placeholder directly inside the input tag attributes.`,
        initialCode: `function TextBox({ placeholder }) {
  return (
    <input 
      type="text" 
      placeholder={placeholder} 
      className="p-2 border rounded text-xs" 
    />
  );
}

export default function App() {
  return (
    <div className="p-4">
      {/* Rendering with no props, should default */}
      <TextBox />
    </div>
  );
}`,
        solutionCode: `function TextBox({ placeholder = "Enter text here..." }) {
  return (
    <input 
      type="text" 
      placeholder={placeholder} 
      className="p-2 border rounded text-xs" 
    />
  );
}

export default function App() {
  return (
    <div className="p-4">
      <TextBox />
    </div>
  );
}`,
        hint: 'Destructure the props in the parameter list as `{ placeholder = "Enter text here..." }`.',
        requirements: [
          {
            id: "renders_input_placeholder",
            text: "Input is rendered successfully",
            test: ({ container }) => {
              const input = container.querySelector("input");
              if (!input) throw new Error("Could not find an <input> tag.");
              return true;
            },
          },
          {
            id: "has_default_placeholder",
            text: "Placeholder has the default value 'Enter text here...'",
            test: ({ container }) => {
              const input = container.querySelector("input");
              if (!input) throw new Error("Could not find an <input> tag.");
              if (input.placeholder !== "Enter text here...") {
                throw new Error(
                  `Expected placeholder to be 'Enter text here...' but found '${input.placeholder}'`,
                );
              }
              return true;
            },
          },
        ],
      },
      {
        id: "children_prop",
        title: "2.5 The Children Prop",
        slug: "children-prop",
        description: `### Nesting with children
What if you want to place custom components or elements *inside* another component? 
\`\`\`jsx
<Card>
  <p>Inside text!</p>
</Card>
\`\`\`
React automatically grabs whatever is nesting between the opening and closing tag, package-binding it inside a special property called **\`children\`**:
\`\`\`jsx
function Card({ children }) {
  return (
    <div className="card-outer">
      {children}
    </div>
  );
}
\`\`\`

### Your Challenge
Update the custom \`Container\` wrapper so that it destructures and outputs the **\`children\`** within its dynamic \`div\` container layout.`,
        initialCode: `function Container({ children }) {
  return (
    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
      {/* Render children markup here */}
    </div>
  );
}

export default function App() {
  return (
    <Container>
      <h2 className="font-bold">Nest Title</h2>
      <p>This is inside children prop!</p>
    </Container>
  );
}`,
        solutionCode: `function Container({ children }) {
  return (
    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Container>
      <h2 className="font-bold">Nest Title</h2>
      <p>This is inside children prop!</p>
    </Container>
  );
}`,
        hint: "Output `{children}` directly inside the container's nested main div block.",
        requirements: [
          {
            id: "has_enclosing_div",
            text: "Renders the styled wrapper div",
            test: ({ container }) => {
              const div = container.querySelector(".bg-blue-50");
              if (!div)
                throw new Error("Could not locate styled wrapping div.");
              return true;
            },
          },
          {
            id: "renders_children",
            text: "Successfully outputs children sub-nodes on screen",
            test: ({ container }) => {
              const h2 = container.querySelector("h2");
              const p = container.querySelector("p");
              if (!h2 || !p)
                throw new Error(
                  "Ensure child elements are compiled and rendered inside the card wrapper.",
                );
              if (p.textContent !== "This is inside children prop!") {
                throw new Error(
                  "Content matched incorrectly inside nested paragraph.",
                );
              }
              return true;
            },
          },
        ],
      },
    ],
  },
  {
    id: "state_reactivity",
    title: "Chapter 3: Interactive State",
    lessons: [
      {
        id: "use_state",
        title: "3.1 Counter (useState)",
        slug: "use-state",
        description: `### What is State?
In React, components can have temporary memory called **State**. 
Unlike standard variables, changes to state variables tell React to immediately **re-render (redraw)** the component to sync the UI with the new data.

### The useState Hook
To add state to a functional component, we use the **\`useState\` Hook**. It takes the **initial value** as an argument and returns an array with exactly two entries:
1. **The current state value** (e.g., \`count\`).
2. **The setter function** used to update that state value (e.g., \`setCount\`).

\`\`\`jsx
import React, { useState } from 'react';

const [count, setCount] = useState(0);
\`\`\`

### Event Handling
To trigger code when a user interacts (like clicking a button), we use event handler props like **\`onClick\`**:
\`\`\`jsx
<button onClick={() => setCount(count + 1)}>
  Click me
</button>
\`\`\`

### Your Challenge
1. Create a state variable named **\`count\`** using \`useState\` and initialize it to **\`0\`**.
2. Bind the click of the increment button so that clicking it triggers a state update, **increasing \`count\` by 1**.
3. Output the dynamic count inside the \`<span>\` element after "Count: ".`,
        initialCode: `import React, { useState } from 'react';

export default function App() {
  // 1. Declare count state here initialized to 0

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-gray-50">
      <span className="text-2xl font-bold bg-white px-4 py-2 rounded shadow-sm">
        Count: {/* 3. Display count state here */}0
      </span>
      <button 
        // 2. Increment count state on click
        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded font-medium cursor-pointer"
      >
        Increment
      </button>
    </div>
  );
}`,
        solutionCode: `import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-gray-50">
      <span className="text-2xl font-bold bg-white px-4 py-2 rounded shadow-sm">
        Count: {count}
      </span>
      <button 
        onClick={() => setCount(count + 1)}
        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded font-medium cursor-pointer"
      >
        Increment
      </button>
    </div>
  );
}`,
        hint: "Declare `const [count, setCount] = useState(0);` inside the component body, attach `onClick={() => setCount(count + 1)}` to the button, and render `{count}` after 'Count: '.",
        requirements: [
          {
            id: "starts_at_zero",
            text: "Initial count is displayed as 'Count: 0'",
            test: ({ container }) => {
              const span = container.querySelector("span");
              if (!span)
                throw new Error("Could not find the count <span> element");
              if (!span.textContent?.trim().includes("Count: 0")) {
                throw new Error(
                  `Expected text to contain "Count: 0" but found "${span.textContent}"`,
                );
              }
              return true;
            },
          },
          {
            id: "increments_one",
            text: "Clicking 'Increment' increases the displayed count to 1",
            test: async ({ container, act }) => {
              const btn = container.querySelector("button");
              if (!btn) throw new Error("Could not find the increment button.");

              await act(() => {
                btn.click();
              });

              const span = container.querySelector("span");
              if (!span?.textContent?.trim().includes("Count: 1")) {
                throw new Error(
                  `Count update failed. Expected text "Count: 1" but found "${span?.textContent}"`,
                );
              }
              return true;
            },
          },
          {
            id: "increments_two",
            text: "Clicking a second time increases the count to 2",
            test: async ({ container, act }) => {
              const btn = container.querySelector("button");
              if (!btn) throw new Error("Could not find the button.");

              await act(() => {
                btn.click();
              });

              const span = container.querySelector("span");
              if (!span?.textContent?.trim().includes("Count: 2")) {
                throw new Error(
                  `Expected text "Count: 2" but found "${span?.textContent}"`,
                );
              }
              return true;
            },
          },
        ],
      },
      {
        id: "state_toggle",
        title: "3.2 Show/Hide Toggle",
        slug: "state-toggle",
        description: `### Managing Boolean States
State variables are not limited to numbers. Boolean toggles are incredibly common in web interfaces (collapsing menus, dialog modals, checking boxes).

To toggle state, you pass the opposite of the current value to the state setter function:
\`\`\`javascript
const [isOpen, setIsOpen] = useState(false);
const toggle = () => setIsOpen(!isOpen);
\`\`\`

Inside the markup, you can choose to conditionally mount components based on that state value:
\`\`\`jsx
{isOpen && <p>Visible Content</p>}
\`\`\`

### Your Challenge
1. Create a state variable named **\`isVisible\`** initialized to **\`true\`**.
2. Clicking the button "Toggle Message" must toggle this boolean state between \`true\` and \`false\`.
3. Highlight or conditionally mount the paragraph \`<p className="text-gray-700">React State is amazing!</p>\` so that it renders **only** when \`isVisible\` is \`true\`.`,
        initialCode: `import React, { useState } from 'react';

export default function App() {
  // 1. Declare isVisible state here (initially true)

  return (
    <div className="p-4 bg-gray-50 rounded-lg border">
      <button 
        // 2. Add custom click toggler
        className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded mb-3 cursor-pointer text-sm font-medium"
      >
        Toggle Message
      </button>
      
      {/* 3. Conditionally render this paragraph below */}
      <p className="text-gray-700 font-medium">React State is amazing!</p>
    </div>
  );
}`,
        solutionCode: `import React, { useState } from 'react';

export default function App() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="p-4 bg-gray-50 rounded-lg border">
      <button 
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded mb-3 cursor-pointer text-sm font-medium"
      >
        Toggle Message
      </button>
      
      {isVisible && <p className="text-gray-700 font-medium">React State is amazing!</p>}
    </div>
  );
}`,
        hint: "Declare `const [isVisible, setIsVisible] = useState(true);`, attach `onClick={() => setIsVisible(!isVisible)}` to the button, and wrap the `<p>` element with `{isVisible && <p>...</p>}`.",
        requirements: [
          {
            id: "visible_initially",
            text: "Paragraph is visible by default when mounting",
            test: ({ container }) => {
              const p = container.querySelector("p");
              if (!p)
                throw new Error(
                  "Paragraph element was not found in initial load.",
                );
              if (p.textContent?.trim() !== "React State is amazing!") {
                throw new Error("Paragraph has incorrect text.");
              }
              return true;
            },
          },
          {
            id: "toggles_off",
            text: "Clicking the button hides the paragraph element",
            test: async ({ container, act }) => {
              const btn = container.querySelector("button");
              if (!btn) throw new Error("Could not find button.");

              await act(() => {
                btn.click();
              });

              const p = container.querySelector("p");
              if (p)
                throw new Error(
                  "Paragraph is still in the DOM after toggling off!",
                );
              return true;
            },
          },
          {
            id: "toggles_back_on",
            text: "Clicking again displays the paragraph element once more",
            test: async ({ container, act }) => {
              const btn = container.querySelector("button");
              if (!btn) throw new Error("Could not find button.");

              await act(() => {
                btn.click(); // off
              });
              await act(() => {
                btn.click(); // back on
              });

              const p = container.querySelector("p");
              if (!p)
                throw new Error(
                  "Paragraph did not reappear in DOM after clicking again.",
                );
              return true;
            },
          },
        ],
      },
      {
        id: "char_count",
        title: "3.3 Text Area Inputs state",
        slug: "char-count",
        description: `### Character tracking
React states can run custom computations easily inside templates! 
If you bind an input characters string state \\\`text\\\`, you can dynamically output its length anywhere:
\`\`\`jsx
<span>Characters typed: {text.length}</span>
\`\`\`

### Your Challenge
1. Set up a state variable named **\`message\`** initialized to an empty string **\`""\`**.
2. Tie that state to the value of the custom \\\`<textarea>\\\` container, updating it in standard callback fashion on edit.
3. Replace the placeholder number inside \\\`Remaining characters:\\\` with the calculated count representing: **\`50 - message.length\`** so the user has warning before they hit limits.`,
        initialCode: `import React, { useState } from 'react';

export default function App() {
  // 1. Declare state variable 'message'

  return (
    <div className="p-4 bg-gray-50 border rounded-lg space-y-3">
      <h3 className="font-bold text-xs uppercase text-slate-500">Post Draft</h3>
      <textarea
        placeholder="Type something..."
        // 2. Control value and bind onChange
        className="w-full p-2.5 bg-white border text-gray-800 rounded text-sm"
      />
      <div className="text-xs text-blue-600 font-semibold text-right">
        Remaining characters: <span className="font-mono">50</span>
      </div>
    </div>
  );
}`,
        solutionCode: `import React, { useState } from 'react';

export default function App() {
  const [message, setMessage] = useState('');

  return (
    <div className="p-4 bg-gray-50 border rounded-lg space-y-3">
      <h3 className="font-bold text-xs uppercase text-slate-500">Post Draft</h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type something..."
        className="w-full p-2.5 bg-white border text-gray-800 rounded text-sm"
      />
      <div className="text-xs text-blue-600 font-semibold text-right">
        Remaining characters: <span className="font-mono">{50 - message.length}</span>
      </div>
    </div>
  );
}`,
        hint: "Initialize state with `const [message, setMessage] = useState('');`. Bind input to value and onChange. Inside the span, write `{50 - message.length}`.",
        requirements: [
          {
            id: "starts_with_full_chars",
            text: "Displays exactly 50 remaining characters initially",
            test: ({ container }) => {
              const span = container.querySelector("span.font-mono");
              if (!span) throw new Error("Could not find character span node.");
              if (span.textContent?.trim() !== "50") {
                throw new Error(
                  `Expected '50' but found '${span.textContent}'`,
                );
              }
              return true;
            },
          },
          {
            id: "updates_on_typing",
            text: "Typing inside textarea updates remaining characters appropriately",
            test: async ({ container, act }) => {
              const textarea = container.querySelector("textarea");
              if (!textarea) throw new Error("Missing textarea node.");

              await act(() => {
                textarea.value = "Hello World";
                textarea.dispatchEvent(new Event("input", { bubbles: true }));
                textarea.dispatchEvent(new Event("change", { bubbles: true }));
              });

              const span = container.querySelector("span.font-mono");
              if (span?.textContent?.trim() !== "39") {
                throw new Error(
                  `Expected remaining count '39' relative to length, found '${span?.textContent}'`,
                );
              }
              return true;
            },
          },
        ],
      },
    ],
  },
  {
    id: "conditional_rendering",
    title: "Chapter 4: Conditional Layouts",
    lessons: [
      {
        id: "ternary_operator",
        title: "4.1 Ternary Operator (? :)",
        slug: "ternary-operator",
        description: `### Conditional Ternaries
React allows you to render completely different blocks of markup dynamically using JavaScript's ternary operator: **\`condition ? ElementA : ElementB\`**.

This acts as an inline \`if-else\` statement:
\`\`\`jsx
return (
  <div>
    {isOnline ? <p>● Online</p> : <p>○ Offline</p>}
  </div>
);
\`\`\`

### Your Challenge
1. Help complete the \`UserGreeting\` component. It receives a boolean prop named **\`isLoggedIn\`**.
2. If \`isLoggedIn\` is **\`true\`**, return a heading \`<h1>Welcome Back, Developer!</h1>\`.
3. If \`isLoggedIn\` is **\`false\`**, return a heading \`<h1>Please sign in to continue</h1>\`.
4. Style the headings using class \`text-xl font-bold\`.

*Note: You can click the "Toggle Login State" button in the preview to test your component dynamically.*`,
        initialCode: `import React, { useState } from 'react';

function UserGreeting({ isLoggedIn }) {
  // Return heading text conditionally based on isLoggedIn prop
  return (
    <div className="p-4 border rounded bg-white shadow-xs">
      
    </div>
  );
}

export default function App() {
  const [isLogged, setIsLogged] = useState(false);
  return (
    <div className="space-y-4 text-center p-4">
      <button 
        onClick={() => setIsLogged(!isLogged)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm cursor-pointer"
      >
        Toggle Login State
      </button>
      <UserGreeting isLoggedIn={isLogged} />
    </div>
  );
}`,
        solutionCode: `import React, { useState } from 'react';

function UserGreeting({ isLoggedIn }) {
  return (
    <div className="p-4 border rounded bg-white shadow-xs">
      {isLoggedIn ? (
        <h1 className="text-xl font-bold">Welcome Back, Developer!</h1>
      ) : (
        <h1 className="text-xl font-bold">Please sign in to continue</h1>
      )}
    </div>
  );
}

export default function App() {
  const [isLogged, setIsLogged] = useState(false);
  return (
    <div className="space-y-4 text-center p-4">
      <button 
        onClick={() => setIsLogged(!isLogged)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-sm cursor-pointer"
      >
        Toggle Login State
      </button>
      <UserGreeting isLoggedIn={isLogged} />
    </div>
  );
}`,
        hint: 'Inside UserGreeting, use `{isLoggedIn ? <h1 className="text-xl font-bold">Welcome Back, Developer!</h1> : <h1 className="text-xl font-bold">Please sign in to continue</h1>}`',
        requirements: [
          {
            id: "initial_logged_off",
            text: "Displays 'Please sign in to continue' when isLoggedIn is false",
            test: ({ container }) => {
              const h1 = container.querySelector("h1");
              if (!h1)
                throw new Error("Could not find any <h1> tag in greeting!");
              if (h1.textContent?.trim() !== "Please sign in to continue") {
                throw new Error(
                  `Expected text 'Please sign in to continue' but found '${h1.textContent?.trim()}'`,
                );
              }
              return true;
            },
          },
          {
            id: "toggles_greeting",
            text: "Displays 'Welcome Back, Developer!' when button toggle makes isLoggedIn true",
            test: async ({ container, act }) => {
              const btn = container.querySelector("button");
              if (!btn) throw new Error("Could not find the toggle button.");

              await act(() => {
                btn.click();
              });

              const h1 = container.querySelector("h1");
              if (!h1)
                throw new Error("Could not find an <h1> tag after click.");
              if (h1.textContent?.trim() !== "Welcome Back, Developer!") {
                throw new Error(
                  `Expected greeting text 'Welcome Back, Developer!' but found '${h1.textContent}'`,
                );
              }
              return true;
            },
          },
        ],
      },
      {
        id: "logical_and_render",
        title: "4.2 Logical AND (&&)",
        slug: "logical-and-render",
        description: `### Shorthand layout checks
If you only need to mount components when a condition is **\`true\`** (without a fallback \`else\` rendering alternative), the Javascript **\`&&\` (logical AND)** is the cleanest approach:
\`\`\`jsx
return (
  <div>
    {hasNotification && <div className="dot">New!</div>}
  </div>
);
\`\`\`
If condition evaluates to true, the element compiles and renders. If false, React skips over it completely.

### Your Challenge
Update the \`AlertCenter\` component so that the custom warning alert div \`<div className="bg-red-100 text-red-700 p-2 text-xs font-bold rounded">Warning Alert!</div>\` displays **only** when the component receives a prop **\`isWarning\`** which evaluates to true.`,
        initialCode: `function AlertCenter({ isWarning }) {
  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="font-bold text-sm mb-2">Notification Hub</h3>
      {/* Conditionally display warning alert below using && */}
      <div className="bg-red-100 text-red-700 p-2 text-xs font-bold rounded">Warning Alert!</div>
    </div>
  );
}

export default function App() {
  return <AlertCenter isWarning={true} />;
}`,
        solutionCode: `function AlertCenter({ isWarning }) {
  return (
    <div className="p-4 border rounded bg-white">
      <h3 className="font-bold text-sm mb-2">Notification Hub</h3>
      {isWarning && (
        <div className="bg-red-100 text-red-700 p-2 text-xs font-bold rounded">Warning Alert!</div>
      )}
    </div>
  );
}

export default function App() {
  return <AlertCenter isWarning={true} />;
}`,
        hint: 'Wrap the warning alert block within brackets like `{isWarning && <div className="bg-red-100...">Warning Alert!</div>}`.',
        requirements: [
          {
            id: "renders_warning_init",
            text: "Displays Warning Alert element when isWarning is true",
            test: ({ container }) => {
              const alertElement = container.querySelector(".bg-red-100");
              if (!alertElement)
                throw new Error("Could not find warning element.");
              return true;
            },
          },
          {
            id: "renders_warning_conditional",
            text: "Warning box vanishes if isWarning is false",
            test: async ({ container, act }) => {
              const src = container.innerHTML;
              if (!src.includes("Notification Hub"))
                throw new Error("Markup missing components.");
              return true;
            },
          },
        ],
      },
    ],
  },
  {
    id: "lists_keys",
    title: "Chapter 5: Lists & Dynamics",
    lessons: [
      {
        id: "map_arrays",
        title: "5.1 Dynamic Lists (Map)",
        slug: "map-arrays",
        description: `### Rendering Lists of Elements
In interactive web applications, we frequently display dynamic lists (e.g., shopping lists, feed cards, direct emails).

To render list items in React, we use the standard JavaScript array **\`map()\`** method to iterate over data and return dynamic JSX tags:
\`\`\`jsx
const items = ['Apples', 'Bananas'];
return (
  <ul>
    {items.map(item => <li>{item}</li>)}
  </ul>
);
\`\`\`

### The Key Prop Requirement
Whenever you render a dynamic array list, React needs a unique identifier prop called **\`key\`** on the root element of each list item:
\`\`\`jsx
{items.map(item => <li key={item}>{item}</li>)}
\`\`\`
This enables React to keep track of individual list items dynamically when additions, removals, or ordering edits occur.

### Your Challenge
Given the array **\`technologies\`**, map over the list and produce a list of **\`<li>\`** child elements inside the \`<ul>\` tags displaying each technology. 
Provide each tag with a **\`key\`** attribute set to the technology's name.`,
        initialCode: `export default function App() {
  const technologies = ["React", "TypeScript", "Vite", "Tailwind"];

  return (
    <div className="p-4 bg-white border rounded">
      <h2 className="font-semibold text-gray-800 mb-2">My Tech Stack:</h2>
      <ul className="list-disc pl-5 text-gray-700">
        {/* Dynamic map rendering goes here */}
        
      </ul>
    </div>
  );
}`,
        solutionCode: `export default function App() {
  const technologies = ["React", "TypeScript", "Vite", "Tailwind"];

  return (
    <div className="p-4 bg-white border rounded">
      <h2 className="font-semibold text-gray-800 mb-2">My Tech Stack:</h2>
      <ul className="list-disc pl-5 text-gray-700">
        {technologies.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
    </div>
  );
}`,
        hint: "Add `{technologies.map(tech => <li key={tech}>{tech}</li>)}` inside the custom `<ul>...</ul>` container wrapper.",
        requirements: [
          {
            id: "renders_four_items",
            text: "Renders exactly 4 list items",
            test: ({ container }) => {
              const lis = container.querySelectorAll("li");
              if (lis.length !== 4) {
                throw new Error(
                  `Expected exactly 4 list items but found ${lis.length}.`,
                );
              }
              return true;
            },
          },
          {
            id: "lists_correct_names",
            text: "Each list item matches names in sequence",
            test: ({ container }) => {
              const lis = container.querySelectorAll("li");
              const names = Array.from(lis).map((item) =>
                item.textContent?.trim(),
              );
              const expected = ["React", "TypeScript", "Vite", "Tailwind"];
              for (let i = 0; i < expected.length; i++) {
                if (names[i] !== expected[i]) {
                  throw new Error(
                    `Expected index ${i} to contain '${expected[i]}', found '${names[i]}'`,
                  );
                }
              }
              return true;
            },
          },
        ],
      },
      {
        id: "list_structured_objects",
        title: "5.2 Rendering List of Objects",
        slug: "list-structured-objects",
        description: `### Dealing with API lists
In production workflows, lists consist of structured objects containing properties (id, text, type, metadata) rather than strings:
\`\`\`javascript
const movies = [
  { id: "mov_1", name: "Inception" },
  { id: "mov_2", name: "Gladiator" }
];
\`\`\`
Since elements have unique identifiers (like \\\`id\\\`), we pass that identifier exactly as our core custom **\`key\`**:
\`\`\`jsx
{movies.map(movie => (
  <div key={movie.id}>{movie.name}</div>
))}
\`\`\`

### Your Challenge
Map over the **\`contacts\`** array list inside the returned layout to render contact cards.
Inside each card, output the contact's name inside the \\\`<h4>\\\` tag, and their email inside the \\\`<span>\\\` tag. Make sure you attach the unique key property correctly to each wrapping contact container div.`,
        initialCode: `export default function App() {
  const contacts = [
    { id: 101, name: "Sarah Connor", email: "sarah@resistance.net" },
    { id: 102, name: "John Connor", email: "john@leader.org" }
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="font-bold text-sm">Emergency Contacts</h2>
      <div className="space-y-2">
        {/* Map over contacts list array here */}
        <div className="p-3 border rounded bg-white">
          <h4 className="font-bold text-xs text-gray-800">Sarah Connor</h4>
          <span className="text-xs text-gray-500">sarah@resistance.net</span>
        </div>
      </div>
    </div>
  );
}`,
        solutionCode: `export default function App() {
  const contacts = [
    { id: 101, name: "Sarah Connor", email: "sarah@resistance.net" },
    { id: 102, name: "John Connor", email: "john@leader.org" }
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="font-bold text-sm">Emergency Contacts</h2>
      <div className="space-y-2">
        {contacts.map((contact) => (
          <div key={contact.id} className="p-3 border rounded bg-white">
            <h4 className="font-bold text-xs text-gray-800">{contact.name}</h4>
            <span className="text-xs text-gray-500">{contact.email}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`,
        hint: "Map over `contacts` with `contacts.map(c => ...)` returning the contact element with `key={c.id}`, displaying `{c.name}` and `{c.email}` inside.",
        requirements: [
          {
            id: "renders_all_contacts",
            text: "Renders exactly 2 cards",
            test: ({ container }) => {
              const h4s = container.querySelectorAll("h4");
              if (h4s.length !== 2) {
                throw new Error(`Expected 2 items but found ${h4s.length}`);
              }
              return true;
            },
          },
          {
            id: "displays_emails",
            text: "Email values are bound correctly",
            test: ({ container }) => {
              const spans = container.querySelectorAll("span");
              const list = Array.from(spans).map((s) => s.textContent?.trim());
              if (!list.includes("john@leader.org")) {
                throw new Error("Could not find leader.org email.");
              }
              return true;
            },
          },
        ],
      },
    ],
  },
  {
    id: "dynamic_forms",
    title: "Chapter 6: Dynamic Forms",
    lessons: [
      {
        id: "controlled_inputs",
        title: "6.1 Controlled Elements",
        slug: "controlled-inputs",
        description: `### What are Controlled Inputs?
In React, input fields are **not** styled to manage their own local state. 
Instead, we push input state into React hooks to keep data fully synchronized and secure. This pattern is called **Controlled components**.

Each controlled input acts as an element where:
1. **The input value** is bounded directly to a state value: \`value={text}\`.
2. **An onChange listener** captures keystrokes and updates state: \`onChange={(e) => setText(e.target.value)}\`.

\`\`\`jsx
const [text, setText] = useState("");
return (
  <input value={text} onChange={(e) => setText(e.target.value)} />
);
\`\`\`

### Your Challenge
1. Create a state variable named **\`note\`** using \`useState\` initialized to an empty string **\`""\`**.
2. Lock the value of the text input to the \`note\` state.
3. Handle input typing updates inside an **\`onChange\`** callback to update \`note\`.
4. Output the typed text dynamically inside the \`p\` display tag after "Your Input note: ".`,
        initialCode: `import React, { useState } from 'react';

export default function App() {
  // 1. Declare note state here

  return (
    <div className="p-4 bg-gray-50 rounded border space-y-4">
      <label className="block text-sm font-semibold text-gray-700">Write Note:</label>
      <input 
        type="text" 
        // 2 & 3. Control input value and bind onChange
        className="border p-2 rounded w-full bg-white text-gray-800"
        placeholder="Type here..." 
      />
      <p className="text-gray-600 bg-white p-2 rounded border border-dashed text-sm">
        Your Input note: {/* 4. Render state here */}
      </p>
    </div>
  );
}`,
        solutionCode: `import React, { useState } from 'react';

export default function App() {
  const [note, setNote] = useState('');

  return (
    <div className="p-4 bg-gray-50 rounded border space-y-4">
      <label className="block text-sm font-semibold text-gray-700">Write Note:</label>
      <input 
        type="text" 
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="border p-2 rounded w-full bg-white text-gray-800"
        placeholder="Type here..." 
      />
      <p className="text-gray-600 bg-white p-2 rounded border border-dashed text-sm">
        Your Input note: {note}
      </p>
    </div>
  );
}`,
        hint: "Declare `const [note, setNote] = useState('');`, set `value={note}` on input, add `onChange={(e) => setNote(e.target.value)}` and output `{note}` inside `<p>`.",
        requirements: [
          {
            id: "has_input",
            text: "Renders the text <input> element",
            test: ({ container }) => {
              const input = container.querySelector("input");
              if (!input) throw new Error("Could not find an input element.");
              return true;
            },
          },
          {
            id: "updates_displays_instantly",
            text: "Typing inside input updates note text dynamically inside the review paragraph",
            test: async ({ container, act }) => {
              const input = container.querySelector("input");
              if (!input) throw new Error("Input element is missing.");

              await act(() => {
                input.value = "React forms are powerful";
                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.dispatchEvent(new Event("change", { bubbles: true }));
              });

              const p = container.querySelector("p");
              if (!p?.textContent?.includes("React forms are powerful")) {
                throw new Error(
                  `The paragraph text did not update properly, content was: "${p?.textContent}"`,
                );
              }
              return true;
            },
          },
        ],
      },
      {
        id: "controlled_select",
        title: "6.2 Select Dropdowns",
        slug: "controlled-select",
        description: `### Dropdown Menus in React
Handling selection choices (\\\`<select>\\\` dropdown tags) in React is identical to input forms! 
Bind the \\\`value\\\` property on the wrapping \\\`<select>\\\` tag to your hook state variable, and handle choices changes in standard \\\`onChange\\\` patterns:
\`\`\`jsx
const [tier, setTier] = useState("free");
return (
  <select value={tier} onChange={(e) => setTier(e.target.value)}>
    <option value="free">Free Starter</option>
    <option value="business">Enterprise Business</option>
  </select>
);
\`\`\`

### Your Challenge
1. Create a dynamic state variable named **\`role\`** initialized to **\`"User"\`**.
2. Tie the value of the custom select element to the \`role\` state.
3. Replace the placeholder text inside the paragraph so that it displays: **\`Role Selected: [Current State]\`**.`,
        initialCode: `import React, { useState } from 'react';

export default function App() {
  // 1. Declare state variable 'role' initialized to "User"

  return (
    <div className="p-4 bg-gray-55 border rounded-lg space-y-4">
      <h3 className="font-bold text-xs">Acl Control Panel</h3>
      <select 
        // 2. Control value and bind onChange
        className="w-full p-2 border bg-white rounded text-sm text-gray-800"
      >
        <option value="User">Standard User</option>
        <option value="Moderator">Moderator</option>
        <option value="Admin">System Administrator</option>
      </select>
      <p className="text-xs text-gray-700 bg-white p-2.5 rounded border">
        {/* 3. Output selection here */}
        Role Selected: User
      </p>
    </div>
  );
}`,
        solutionCode: `import React, { useState } from 'react';

export default function App() {
  const [role, setRole] = useState('User');

  return (
    <div className="p-4 bg-gray-55 border rounded-lg space-y-4">
      <h3 className="font-bold text-xs">Acl Control Panel</h3>
      <select 
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 border bg-white rounded text-sm text-gray-800"
      >
        <option value="User">Standard User</option>
        <option value="Moderator">Moderator</option>
        <option value="Admin">System Administrator</option>
      </select>
      <p className="text-xs text-gray-700 bg-white p-2.5 rounded border">
        Role Selected: {role}
      </p>
    </div>
  );
}`,
        hint: "Initialize `role` state with 'User'. Add `value={role}` and `onChange={e => setRole(e.target.value)}` to `<select>`, and display `Role Selected: {role}`.",
        requirements: [
          {
            id: "select_initial",
            text: "Correctly lists initial selection as 'Role Selected: User'",
            test: ({ container }) => {
              const p = container.querySelector("p");
              if (!p?.textContent?.includes("Role Selected: User")) {
                throw new Error("Could not find default selection output.");
              }
              return true;
            },
          },
          {
            id: "select_interactive",
            text: "Selecting Admin option updates label to 'Role Selected: Admin'",
            test: async ({ container, act }) => {
              const select = container.querySelector("select");
              if (!select) throw new Error("Missing select element.");

              await act(() => {
                select.value = "Admin";
                select.dispatchEvent(new Event("change", { bubbles: true }));
              });

              const p = container.querySelector("p");
              if (!p?.textContent?.includes("Role Selected: Admin")) {
                throw new Error(
                  `Select update failed, displayed as: '${p?.textContent}'`,
                );
              }
              return true;
            },
          },
        ],
      },
      {
        id: "form_submissions",
        title: "6.3 Form Submissions (onSubmit)",
        slug: "form-submissions",
        description: `### Handling Forms Elements
In standard browsers, clicking buttons inside templates sends post back triggers or refreshes pages automatically. 
In single-page React apps, we handle forms completely client-side in Javascript.

To intercept submissions, we listen to the **\`onSubmit\`** event of the wrapping \\\`<form>\\\` tag and execute **\`event.preventDefault()\`** immediately:
\`\`\`jsx
const handleSubmit = (e) => {
  e.preventDefault(); // Stop page refresh!
  console.log("Saving item...");
};
return (
  <form onSubmit={handleSubmit}>
    <button type="submit">Submit</button>
  </form>
);
\`\`\`

### Your Challenge
1. In the \`handleSubmit\` handler, invoke **\`e.preventDefault()\`** to avoid standard postback loops.
2. Inside that handler, trigger an action: set state variable **\`submitted\`** to **\`true\`**.
3. Render is warning label saying **\`"Submit Success! Ticket logged."\`** inside the dynamic alerts div only when \`submitted\` is true.`,
        initialCode: `import React, { useState } from 'react';

export default function App() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    // 1. Prevent default form submission refresh behavior
    
    // 2. Set 'submitted' state variable to true
    
  };

  return (
    <div className="p-4 bg-gray-50 border rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-xs font-bold">Priority Status Label</label>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 text-xs font-semibold rounded cursor-pointer"
        >
          Submit Ticket
        </button>
      </form>
      
      {/* 3. Conditionally display indicator below */}
      <div id="success-indicator" className="mt-3 text-emerald-600 text-xs font-semibold text-center">
        Submit Success! Ticket logged.
      </div>
    </div>
  );
}`,
        solutionCode: `import React, { useState } from 'react';

export default function App() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-4 bg-gray-50 border rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-xs font-bold">Priority Status Label</label>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white py-2 text-xs font-semibold rounded cursor-pointer"
        >
          Submit Ticket
        </button>
      </form>
      
      {submitted && (
        <div id="success-indicator" className="mt-3 text-emerald-600 text-xs font-semibold text-center">
          Submit Success! Ticket logged.
        </div>
      )}
    </div>
  );
}`,
        hint: "Call `e.preventDefault();` and `setSubmitted(true);` in handleSubmit, and conditionally wrap the success-indicator div using `{submitted && <div ...>...</div>}`.",
        requirements: [
          {
            id: "starts_not_submitted",
            text: "Does not display the success label by default",
            test: ({ container }) => {
              const indicator = container.querySelector("#success-indicator");
              if (indicator)
                throw new Error(
                  "Success indicator is shown before submitting.",
                );
              return true;
            },
          },
          {
            id: "triggers_correct_on_submit",
            text: "Submitting form calls submission callback and shows success label successfully",
            test: async ({ container, act }) => {
              const button = container.querySelector("button[type='submit']");
              if (!button) throw new Error("Missing submit button.");

              await act(() => {
                button.click();
              });

              const indicator = container.querySelector("#success-indicator");
              if (!indicator)
                throw new Error("Submit indicator failed to render on click.");
              if (
                indicator.textContent?.trim() !==
                "Submit Success! Ticket logged."
              ) {
                throw new Error("Wrong indicator messages shown.");
              }
              return true;
            },
          },
        ],
      },
    ],
  },
  {
    id: "side_effects",
    title: "Chapter 7: Side Effects (useEffect)",
    lessons: [
      {
        id: "effect_on_mount",
        title: "7.1 Core Hooks (Mount)",
        slug: "effect-on-mount",
        description: `### Running Actions: Component Mount
Sometimes you need to perform actions exactly **once** when a component appears on the screen (e.g. tracking visitors, fetching initial api values). 

React resolves this using the **\`useEffect\` hook** with an **empty dependency array \`[]\`** as the second argument:
\`\`\`javascript
useEffect(() => {
  console.log("Component appeared!");
}, []); // Empty brackets run ONLY on mount!
\`\`\`

### Your Challenge
1. Complete the \`useEffect\` hook inside App.
2. Inside that hook, update your state variable **\`status\`** to say **\`"Active Session Ready"\`** exactly when mounting occurs.`,
        initialCode: `import React, { useState, useEffect } from 'react';

export default function App() {
  const [status, setStatus] = useState("Booting...");

  useEffect(() => {
    // Write mount update trigger here
    
  }, []);

  return (
    <div className="p-4 bg-gray-50 border rounded-lg text-center">
      <div className="text-xs text-gray-500 uppercase font-bold">Status Badge</div>
      <p id="channel-badge" className="text-sm font-semibold text-blue-600 mt-1">
        {status}
      </p>
    </div>
  );
}`,
        solutionCode: `import React, { useState, useEffect } from 'react';

export default function App() {
  const [status, setStatus] = useState("Booting...");

  useEffect(() => {
    setStatus("Active Session Ready");
  }, []);

  return (
    <div className="p-4 bg-gray-50 border rounded-lg text-center">
      <div className="text-xs text-gray-500 uppercase font-bold">Status Badge</div>
      <p id="channel-badge" className="text-sm font-semibold text-blue-600 mt-1">
        {status}
      </p>
    </div>
  );
}`,
        hint: 'Inside standard mount boundaries, call `setStatus("Active Session Ready")`.',
        requirements: [
          {
            id: "renders_status_badge",
            text: "Displays 'Active Session Ready' on screen mount",
            test: ({ container }) => {
              const badge = container.querySelector("#channel-badge");
              if (badge?.textContent?.trim() !== "Active Session Ready") {
                throw new Error(
                  `Expected text to be "Active Session Ready" but found "${badge?.textContent}"`,
                );
              }
              return true;
            },
          },
        ],
      },
      {
        id: "effect_dependencies",
        title: "7.2 Conditional Trigger Effects",
        slug: "effect-dependencies",
        description: `### Watching State Variables
If you provide variables inside the **dependency list \`[yourState]\`**, the \`useEffect\` hook runs again automatically **every single time** those variables change!
\`\`\`javascript
useEffect(() => {
  console.log("Count changed!");
}, [count]); // Fires on initial mount AND on counts update!
\`\`\`

### Your Challenge
1. Bind a \`useEffect\` hook that watches changes to state variable **\`multiplier\`**.
2. Whenever \`multiplier\` changes, update and set variable **\`total\`** equal to **\`multiplier * 10\`**.`,
        initialCode: `import React, { useState, useEffect } from 'react';

export default function App() {
  const [multiplier, setMultiplier] = useState(1);
  const [total, setTotal] = useState(10);

  // Write useEffect watching multiplier here


  return (
    <div className="p-4 bg-gray-50 border rounded text-center space-y-3">
      <span className="text-xs text-gray-400 block font-bold">Multi calculator</span>
      <div id="math-grid" className="text-lg font-black text-gray-800">
        10 x {multiplier} = {total}
      </div>
      <button 
        onClick={() => setMultiplier(multiplier + 1)}
        className="px-3 py-1 bg-gray-800 text-white rounded text-xs cursor-pointer hover:bg-gray-905"
      >
        Increase Factor
      </button>
    </div>
  );
}`,
        solutionCode: `import React, { useState, useEffect } from 'react';

export default function App() {
  const [multiplier, setMultiplier] = useState(1);
  const [total, setTotal] = useState(10);

  useEffect(() => {
    setTotal(multiplier * 10);
  }, [multiplier]);

  return (
    <div className="p-4 bg-gray-50 border rounded text-center space-y-3">
      <span className="text-xs text-gray-400 block font-bold">Multi calculator</span>
      <div id="math-grid" className="text-lg font-black text-gray-800">
        10 x {multiplier} = {total}
      </div>
      <button 
        onClick={() => setMultiplier(multiplier + 1)}
        className="px-3 py-1 bg-gray-800 text-white rounded text-xs cursor-pointer hover:bg-gray-905"
      >
        Increase Factor
      </button>
    </div>
  );
}`,
        hint: "Declare `useEffect(() => { setTotal(multiplier * 10); }, [multiplier])`.",
        requirements: [
          {
            id: "initializes_aligned",
            text: "Displays calculated answer initially of '10 x 1 = 10'",
            test: ({ container }) => {
              const grid = container.querySelector("#math-grid");
              if (!grid?.textContent?.trim().includes("10 x 1 = 10")) {
                throw new Error("Grid math misaligned or unrendered.");
              }
              return true;
            },
          },
          {
            id: "recalculates_on_increment",
            text: "Clicking increases factor and side effect updates calculation label",
            test: async ({ container, act }) => {
              const btn = container.querySelector("button");
              if (!btn) throw new Error("Missing multiplier button.");

              await act(() => {
                btn.click();
              });

              const grid = container.querySelector("#math-grid");
              if (!grid?.textContent?.trim().includes("10 x 2 = 20")) {
                throw new Error(
                  "Dependency-driven effect calculation failed on status change.",
                );
              }
              return true;
            },
          },
        ],
      },
      {
        id: "mock_api_fetch",
        title: "7.3 Simulating Fetch Requests",
        slug: "mock-api-fetch",
        description: `### Making API Requests cleanly
In dynamic apps, data comes from remote secure servers. We handle this inside \\\`useEffect\\\` hooks:
1. Show a loading block of markup initially (\\\`isLoading === true\\\`).
2. Kick off the asynchronous fetch trigger.
3. Once the response arrives, save it inside local states and toggle \\\`isLoading\\\` off.

\`\`\`javascript
useEffect(() => {
  setIsLoading(true);
  fetch("/api/data").then(r => r.json()).then(data => {
    setProfile(data);
    setIsLoading(false);
  });
}, []);
\`\`\`

### Your Challenge
Let's simulate a server fetch request. 
Inside the \\\`useEffect\\\` hook, invoke a standard JS timeout callback timer **\`setTimeout\`** set to **\`350ms\`**. 
Once that timer resolves, save mock user data **\`"Emma Watson (Wand Expert)"\`** inside state variable **\`userData\`** and toggle **\`isLoading\`** to \`false\` so the user views profile details.`,
        initialCode: `import React, { useState, useEffect } from 'react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState('');

  useEffect(() => {
    // 1. Simulating async request block
    const timer = setTimeout(() => {
      // 2. Set userData to "Emma Watson (Wand Expert)"
      
      // 3. Toggle loading flag off
      
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 bg-gray-50 border rounded-lg text-center font-sans">
      {isLoading ? (
        <p id="loading-txt" className="text-xs text-gray-500 animate-pulse font-bold">
          Loading active Profile...
        </p>
      ) : (
        <div id="profile-card">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Profile Card</span>
          <h2 className="text-base font-extrabold text-blue-600 mt-0.5">{userData}</h2>
        </div>
      )}
    </div>
  );
}`,
        solutionCode: `import React, { useState, useEffect } from 'react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setUserData("Emma Watson (Wand Expert)");
      setIsLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 bg-gray-55 border rounded-lg text-center font-sans">
      {isLoading ? (
        <p id="loading-txt" className="text-xs text-gray-500 animate-pulse font-bold">
          Loading active Profile...
        </p>
      ) : (
        <div id="profile-card">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Profile Card</span>
          <h2 className="text-base font-extrabold text-blue-600 mt-0.5">{userData}</h2>
        </div>
      )}
    </div>
  );
}`,
        hint: 'Inside setTimeout callback, use `setUserData("Emma Watson (Wand Expert)");` and `setIsLoading(false);`.',
        requirements: [
          {
            id: "shows_loading_init",
            text: "Displays Loading message on screen mount",
            test: ({ container }) => {
              const loading = container.querySelector("#loading-txt");
              if (!loading && !container.querySelector("#profile-card")) {
                throw new Error("Neither loading nor card details present.");
              }
              return true;
            },
          },
          {
            id: "resolves_profile_card",
            text: "Simulated load callback prints final userData Emma Watson",
            test: async ({ container, act }) => {
              // Yield a few ms for timeout simulation
              await new Promise((r) => setTimeout(r, 220));
              const card = container.querySelector("#profile-card h2");
              if (!card)
                throw new Error("Card failed to render after simulated timer.");
              if (card.textContent !== "Emma Watson (Wand Expert)") {
                throw new Error(
                  `Profile contains wrong name: '${card.textContent}'`,
                );
              }
              return true;
            },
          },
        ],
      },
    ],
  },
  {
    id: "context_api",
    title: "Chapter 8: Context API & Sharing",
    lessons: [
      {
        id: "lifting_state",
        title: "8.1 State Lifting (Lift Up)",
        slug: "lifting-state",
        description: `### Sharing local state
In standard designs, states are local to the declaring component. 
If sister components (siblings) need to communicate or synchronize with each other, we **"lift state up"** to their nearest common parent!

The parent component holds and coordinates the state, passing both its value and updates handler down to children inside props attributes:
\`\`\`jsx
function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Toggler onClick={() => setOpen(!open)} />
      <Panel open={open} />
    </>
  );
}
\`\`\`

### Your Challenge
1. In the parent \`App\`, declare a state variable named **\`active\`** initialized to **\`false\`**.
2. Inside App's returned layout, pass matching prop values to:
   - \`active\` state to the custom \`Panel\` through property **\`isActive\`**.
   - setter function to the toggle \`Button\` through property **\`toggleActive\`**. Make clicking it toggle the boolean value of active on and off.`,
        initialCode: `import React, { useState } from 'react';

function Button({ toggleActive }) {
  return (
    <button 
      onClick={toggleActive}
      className="bg-gray-800 text-white font-semibold text-xs px-3 py-1.5 rounded cursor-pointer"
    >
      Toggle Switch
    </button>
  );
}

function Panel({ isActive }) {
  return (
    <div className="p-3 rounded border text-xs font-bold font-mono">
      Status: {isActive ? "ACTIVE" : "OFFLINE"}
    </div>
  );
}

export default function App() {
  // 1. Declare state variable 'active' here

  return (
    <div className="p-4 bg-gray-50 border rounded-lg space-y-3 flex flex-col items-center">
      {/* 2. Bind sibling custom components */}
      <Button toggleActive={null} />
      <Panel isActive={false} />
    </div>
  );
}`,
        solutionCode: `import React, { useState } from 'react';

function Button({ toggleActive }) {
  return (
    <button 
      onClick={toggleActive}
      className="bg-gray-800 text-white font-semibold text-xs px-3 py-1.5 rounded cursor-pointer"
    >
      Toggle Switch
    </button>
  );
}

function Panel({ isActive }) {
  return (
    <div className="p-3 rounded border text-xs font-bold font-mono">
      Status: {isActive ? "ACTIVE" : "OFFLINE"}
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState(false);

  return (
    <div className="p-4 bg-gray-50 border rounded-lg space-y-3 flex flex-col items-center">
      <Button toggleActive={() => setActive(!active)} />
      <Panel isActive={active} />
    </div>
  );
}`,
        hint: "Initialize state with `const [active, setActive] = useState(false);`. Pass `toggleActive={() => setActive(!active)}` to Button and `isActive={active}` to Panel.",
        requirements: [
          {
            id: "starts_offline",
            text: "Status initializes to OFFLINE mode",
            test: ({ container }) => {
              const sCard = container.querySelector(".font-mono");
              if (!sCard?.textContent?.includes("Status: OFFLINE")) {
                throw new Error("Panel state should start default offline.");
              }
              return true;
            },
          },
          {
            id: "synchronizes_click",
            text: "Clicking toggle button propagates state update to sister component and changes badge to ACTIVE",
            test: async ({ container, act }) => {
              const btn = container.querySelector("button");
              if (!btn) throw new Error("Could not find trigger button.");

              await act(() => {
                btn.click();
              });

              const sCard = container.querySelector(".font-mono");
              if (!sCard?.textContent?.includes("Status: ACTIVE")) {
                throw new Error(
                  "Lifting state coordination failed on propagation.",
                );
              }
              return true;
            },
          },
        ],
      },
    ],
  },
];
