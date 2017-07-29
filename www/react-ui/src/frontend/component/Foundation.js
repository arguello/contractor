import React from 'react';
import CInP from './cinp';
import ConfigDialog from './ConfigDialog';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox';
import { Link } from 'react-router-dom';


class Foundation extends React.Component
{
  state = {
      foundation_list: [],
      foundation: null,
      foundationDependancy_list: []
  };

  componentDidMount()
  {
    this.update( this.props );
  }

  componentWillReceiveProps( newProps )
  {
    this.setState( { foundation_list: [], foundation: null } );
    this.update( newProps );
  }

  update( props )
  {
    if( props.id !== undefined )
    {
      props.detailGet( props.id )
       .then( ( result ) =>
        {
          var data = result.data;
          data.site = CInP.extractIds( data.site )[0];
          data.blueprint = CInP.extractIds( data.blueprint )[0];
          data.config_values = Object.keys( data.config_values ).map( ( key ) => ( [ key, data.config_values[ key ] ] ) );
          this.setState( { foundation: data } );
        } );
      props.detailGetDependancies( props.id )
        .then( ( result ) =>
        {
          var dependancy_list = [];
          for ( var id in result.data )
          {
            var dependancy = result.data[ id ];
            dependancy_list.push( { id: id,
                                    structure: CInP.extractIds( dependancy.structure )[0],
                                    state: dependancy.state,
                                  } );
          }
          this.setState( { foundationDependancy_list: dependancy_list } );
        } );
    }
    else
    {
      props.listGet( props.site )
        .then( ( result ) =>
        {
          var foundation_list = [];
          for ( var id in result.data )
          {
            var foundation = result.data[ id ];
            id = CInP.extractIds( id )[0];
            foundation_list.push( { id: id,
                                    locator: foundation.locator,
                                    type: foundation.type,
                                    state: foundation.state,
                                    created: foundation.created,
                                    updated: foundation.updated,
                                  } );
          }

          this.setState( { foundation_list: foundation_list } );
        } );
    }
  }

  render()
  {
    if( this.props.id !== undefined )
    {
      var foundation = this.state.foundation;
      return (
        <div>
          <h3>Foundation Detail</h3>
          { foundation !== null &&
            <div>
              <ConfigDialog getConfig={ this.props.getConfig } uri={ '/api/v1/Building/Foundation:' + this.props.id + ':' } />
              <table>
                <thead/>
                <tbody>
                  <tr><th>Site</th><td><Link to={ '/site/' + foundation.site }>{ foundation.site }</Link></td></tr>
                  <tr><th>Locator</th><td>{ foundation.locator }</td></tr>
                  <tr><th>State</th><td>{ foundation.state }</td></tr>
                  <tr><th>Type</th><td>{ foundation.type }</td></tr>
                  <tr><th>Can Auto Locate/Auto Build</th><td>{ foundation.can_auto_locate }</td></tr>
                  <tr><th>Blueprint</th><td><Link to={ '/blueprint/f/' + foundation.blueprint }>{ foundation.blueprint }</Link></td></tr>
                  <tr><th>Id Map</th><td>{ foundation.id_map }</td></tr>
                  <tr><th>Interfaces</th><td>{ foundation.interfaces }</td></tr>
                  <tr><th>Class List</th><td>{ foundation.class_list }</td></tr>
                  <tr><th>Config Values</th><td><table><thead/><tbody>{ foundation.config_values.map( ( value ) => ( <tr key={ value[0] }><th>{ value[0] }</th><td>{ value[1] }</td></tr> ) ) }</tbody></table></td></tr>
                  <tr><th>Created</th><td>{ foundation.created }</td></tr>
                  <tr><th>Updated</th><td>{ foundation.updated }</td></tr>
                  <tr><th>Located At</th><td>{ foundation.located_at }</td></tr>
                  <tr><th>Built At</th><td>{ foundation.built_at }</td></tr>
                </tbody>
              </table>
              <h3>Depends on</h3>
              <ul>
              { this.state.foundationDependancy_list.map( ( item, index ) => (
                <li key={ index }><Link to={ '/structure/' + item.structure }>{ item.structure }</Link> - { item.state }</li>
              ) ) }
              </ul>
            </div>
          }
        </div>
      );
    }

    return (
      <Table selectable={ false } multiSelectable={ false }>
        <TableHead>
          <TableCell numeric>Id</TableCell>
          <TableCell>Locator</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>State</TableCell>
          <TableCell>Created</TableCell>
          <TableCell>Updated</TableCell>
        </TableHead>
        { this.state.foundation_list.map( ( item ) => (
          <TableRow key={ item.id }>
            <TableCell numeric><Link to={ '/foundation/' + item.id }>{ item.id }</Link></TableCell>
            <TableCell>{ item.locator }</TableCell>
            <TableCell>{ item.type }</TableCell>
            <TableCell>{ item.state }</TableCell>
            <TableCell>{ item.created }</TableCell>
            <TableCell>{ item.updated }</TableCell>
          </TableRow>
        ) ) }
      </Table>
    );

  }
};

export default Foundation;
