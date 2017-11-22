import React from 'react'

import { Mso } from 'mdast-react-render/lib/email'

export default ({children}) => (
  <tr>
    <td align='center' valign='top'>
      <Mso>
        {`
      <table cellspacing="0" cellpadding="0" border="0" width="640">
        <tr>
          <td>
        `}
      </Mso>
      <table align='center' border='0' cellPadding='0' cellSpacing='0' width='100%' style={{
        maxWidth: 640,
        color: '#444',
        fontSize: 18,
        fontFamily: 'Times, \'Times New Roman\', serif'
      }}>
        <tbody>
          <tr>
            <td style={{padding: 20}} className='body_content'>
              {children}
            </td>
          </tr>
          <tr>
            <td style={{padding: 20}}>
              <p>
                <a href='https://www.republik.ch/'>
                  <img height='79' src='https://assets.project-r.construction/images/logo_republik_newsletter.png' style={{
                    border: 0,
                    width: '180px !important',
                    height: '79px !important',
                    margin: 0,
                    maxWidth: '100% !important'
                  }} width='180' alt='' />
                </a>
              </p>
              <p>
              Republik AG<br />
              Sihlhallenstrasse 1<br />
              8004 Zürich</p>
              <br />
              <p>
                <a href='https://project-r.construction/'>
                  <img src='https://assets.project-r.construction/images/project_r_logo_newsletter.png' style={{
                    border: 0,
                    width: '50px !important',
                    height: '50px !important',
                    margin: 0,
                    maxWidth: '100% !important'
                  }} width='50' height='50' alt='' />
                </a>
              </p>
              <br />
              Project R Genossenschaft<br />
              Sihlhallenstrasse 1<br />
              8004 Zürich<br />
              <hr />
              <p>
                <a href='*|UNSUB|*'>Vom Newsletter abmelden</a>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <Mso>
        {`
      </td>
    </tr>
  </table>
        `}
      </Mso>
    </td>
  </tr>
)
