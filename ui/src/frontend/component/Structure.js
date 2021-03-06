import React from 'react';
import CInP from './cinp';
import ConfigDialog from './ConfigDialog';
import { Table, TableHead, TableRow, TableCell } from 'react-toolbox';
import { Link } from 'react-router-dom';


class Structure extends React.Component
{
  state = {
      structure_list: [],
      structure: null,
      address_list: []
  };

  componentDidMount()
  {
    this.update( this.props );
  }

  componentWillReceiveProps( newProps )
  {
    this.setState( { structure_list: [], structure: null } );
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
          data.foundation = CInP.extractIds( data.foundation )[0];
          data.config_values = Object.keys( data.config_values ).map( ( key ) => ( [ key, JSON.stringify( data.config_values[ key ] ) ] ) );
          this.setState( { structure: data } );

          props.getAddressList( props.id )
            .then( ( result ) =>
            {
              var address_list = [];
              for ( var id in result.data )
              {
                var address = result.data[ id ];
                id = CInP.extractIds( id )[0];
                address_list.push( { id: id,
                                        offset: address.offset,
                                        ip_address: address.ip_address,
                                        interface_name: address.interface_name,
                                        created: address.created,
                                        updated: address.updated,
                                      } );
              }

              this.setState( { address_list: address_list } );
            } );
        } );
    }
    else
    {
      props.listGet( props.site )
        .then( ( result ) =>
        {
          var structure_list = [];
          for ( var id in result.data )
          {
            var structure = result.data[ id ];
            id = CInP.extractIds( id )[0];
            structure_list.push( { id: id,
                                    hostname: structure.hostname,
                                    state: structure.state,
                                    created: structure.created,
                                    updated: structure.updated,
                                  } );
          }

          this.setState( { structure_list: structure_list } );
        } );
    }
  }

  render()
  {
    if( this.props.id !== undefined )
    {
      var structure = this.state.structure;
      return (
        <div>
          <h3>Structure Detail</h3>
          { structure !== null &&
            <div>
              <ConfigDialog getConfig={ this.props.getConfig } uri={ '/api/v1/Building/Structure:' + this.props.id + ':' } />
              <table>
                <thead/>
                <tbody>
                  <tr><th>Site</th><td><Link to={ '/site/' + structure.site }>{ structure.site }</Link></td></tr>
                  <tr><th>Foundation</th><td><Link to={ '/foundation/' + structure.foundation }>{ structure.foundation }</Link></td></tr>
                  <tr><th>Hostname</th><td>{ structure.hostname }</td></tr>
                  <tr><th>State</th><td>{ structure.state }</td></tr>
                  <tr><th>Type</th><td>{ structure.type }</td></tr>
                  <tr><th>Blueprint</th><td><Link to={ '/blueprint/s/' + structure.blueprint }>{ structure.blueprint }</Link></td></tr>
                  <tr><th>Config UUID</th><td>{ structure.config_uuid }</td></tr>
                  <tr><th>Config Values</th><td><table><thead/><tbody>{ structure.config_values.map( ( item, index ) => ( <tr key={ index }><th>{ item[0] }</th><td>{ item[1] }</td></tr> ) ) }</tbody></table></td></tr>
                  <tr><th>Created</th><td>{ structure.created }</td></tr>
                  <tr><th>Updated</th><td>{ structure.updated }</td></tr>
                  <tr><th>Built At</th><td>{ structure.built_at }</td></tr>
                  <tr><th colSpan="2">Ip Addresses</th></tr>
                  <tr><td colSpan="2"><table>
                  <thead><tr><th>Offset</th><th>Ip Address</th><th>Interface</th><th>Created</th><th>Updated</th></tr></thead>
                  <tbody>
                  { this.state.address_list.map( ( item ) => (
                    <tr key={ item.id }><td>{ item.offset }</td><td>{ item.ip_address }</td><td>{ item.interface_name }</td><td>{ item.created }</td><td>{ item.updated }</td></tr>
                  ) ) }
                  </tbody>
                  </table></td></tr>
                </tbody>
              </table>
            </div>
          }
        </div>
      );
    }

    return (
      <Table selectable={ false } multiSelectable={ false }>
        <TableHead>
          <TableCell numeric>Id</TableCell>
          <TableCell>Hostname</TableCell>
          <TableCell>State</TableCell>
          <TableCell>Created</TableCell>
          <TableCell>Updated</TableCell>
        </TableHead>
        { this.state.structure_list.map( ( item ) => (
          <TableRow key={ item.id }>
            <TableCell numeric><Link to={ '/structure/' + item.id }>{ item.id }</Link></TableCell>
            <TableCell>{ item.hostname }</TableCell>
            <TableCell>{ item.state }</TableCell>
            <TableCell>{ item.created }</TableCell>
            <TableCell>{ item.updated }</TableCell>
          </TableRow>
        ) ) }
      </Table>
    );

  }
};

export default Structure;
