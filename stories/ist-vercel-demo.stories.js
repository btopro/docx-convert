import { html } from 'lit';
import '../src/ist-vercel-demo.js';

export default {
  title: 'IstVercelDemo',
  component: 'ist-vercel-demo',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ title, backgroundColor }) {
  return html`
    <ist-vercel-demo
      style="--ist-vercel-demo-background-color: ${backgroundColor || 'white'}"
      .title=${title}
    >
    </ist-vercel-demo>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
