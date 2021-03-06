
$(document).ready(function(){

    $('#tier2Modal').on('shown.bs.modal', function() {

        $("#clientId").append("<option selected disabled hidden>Select Client</option>");

        $("#providerId").empty();
        $("#providerId").append("<option selected disabled hidden>Select Provider</option>");
        
        $("#tier1Link").empty();
        $("#tier1Link").append("<option selected disabled hidden>Select Tier1Link</option>");

        $("#tier2Link").val("");
        $("#anchorText").val("");

    });
    //Begin search function

    $(document).on('keyup', '#search', function(){

        var filter =  $("#search").val().toLowerCase();

        $("#tier2 tbody tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(filter) > -1)
        });
    })

    //end search function

    //getProviderId
    function getProviderId(selectedClient, isAdd, selectedProvider) {
        $.ajax({
            url: '/get-ProviderId',
            method: 'post',
            timeout: 20000,
            data: {
                _token: $('#token').val(),
                client_id: selectedClient
            },
            success: function (response){

                //Begin process response
                if(response.success == true){

                    var provider = response.data.provider_id;

                    $('#providerId').empty();
                    $('#tier1Link').empty();
                    $('#providerIdEdit').empty();
                    $('#tier1LinkEdit').empty();
                    
                    for($i=0; $i< provider.length; $i++){

                        rowTemplate = '<option>{provider[$i]}</option>';

                        rowTemplate = rowTemplate.replace('{provider[$i]}', provider[$i]);

                        if (isAdd)
                            $('#providerId').append(rowTemplate);
                        else
                            $('#providerIdEdit').append(rowTemplate);

                    }

                    if (isAdd) {

                        rowTemplate = '<option selected disabled hidden>Select Provider</option>';
                        $('#providerId').append(rowTemplate);

                        rowTemplate = '<option selected disabled hidden>Select Tier1Link</option>';
                        $('#tier1Link').append(rowTemplate);

                        $("#providerId").prop("disabled", false);

                    } else {
                        
                        if (selectedProvider != "") {                        

                            $("#providerIdEdit").val(selectedProvider);

                        } else {

                            console.log("here");
                            rowTemplate = '<option selected disabled hidden>Select Provider</option>';
                            $('#providerIdEdit').append(rowTemplate);

                            rowTemplate = '<option selected disabled hidden>Select Tier1Link</option>';
                            $('#tier1LinkEdit').append(rowTemplate);

                        }

                        $("#providerIdEdit").prop("disabled", false);
                        $("#tier1LinkEdit").prop("disabled", false);

                    }
    
                }else if (response.success == false) {

                    if (response.data.action == 'reloadPage') {
    
                        window.showCSRFModal();
                        return false;
    
                    }
                }
            }
        })
    }
    //end getProviderId

    //Begin getProviderId function
    $(document).on('change', '#clientId', function(){

        var selectedClient = $('#clientId').val();
        
        $("#providerId").prop("disabled", true);

        getProviderId(selectedClient, true);

    });
    //End getProviderId function

    //Begin getProviderID from Edit
    $(document).on('change', '#clientIdEdit', function(){

        var selectedClient = $('#clientIdEdit').val();
        
        $("#providerIdEdit").prop("disabled", true);
        $("#tier1LinkIdEdit").prop("disabled", true);

        getProviderId(selectedClient, false, '');

    });
    //End getProviderId

    //Begin getProviderID from Edit
    $(document).on('change', '#providerIdEdit', function(){

        var selectedClient = $('#clientIdEdit').val();
        var selectedProvider = $('#providerIdEdit').val();        
        
        $("#tier1LinkEdit").prop("disabled", true);

        getTier1Link(selectedClient, selectedProvider, false, '');

    });
    //End getProviderId

    //Begin getTier1Link
    function getTier1Link(selectedClient, selectedProvider, isAdd, selectedTier1) {
        $.ajax({
            url: '/get-Tier1Link',
            method: 'post',
            timeout: 20000,
            data: {
                _token: $('#token').val(),
                client_id: selectedClient,
                provider_id: selectedProvider
            },
            success: function (response){

                //Begin process response
                if(response.success == true){
                    
                    var tier1_link = response.data.tier1_link;
                    
                    $('#tier1Link').empty();
                    $('#tier1LinkEdit').empty();
                    
                    for($i=0; $i< tier1_link.length; $i++){        

                        rowTemplate = '<option>{tier1_link[$i]}</option>';
                        rowTemplate = rowTemplate.replace('{tier1_link[$i]}', tier1_link[$i]);

                        if(isAdd) 
                            $('#tier1Link').append(rowTemplate);    
                        else
                            $('#tier1LinkEdit').append(rowTemplate);
                        
                    }

                    if(isAdd) {

                        rowTemplate = '<option selected disabled hidden>Select Tier1Link</option>';
                        $('#tier1Link').append(rowTemplate);

                    } else {

                        if (selectedTier1 != '')
                            $("#tier1LinkEdit").val(selectedTier1);
                        else {

                            rowTemplate = '<option selected disabled hidden>Select Tier1Link</option>';
                            $('#tier1LinkEdit').append(rowTemplate);

                        }

                    }

                    $("#tier1LinkEdit").prop("disabled", false);

                }else if (response.success == false) {

                    if (response.data.action == 'reloadPage') {
    
                        window.showCSRFModal();
                        return false;
    
                    }
                }
            }
        })
    }
    //End getTier1Link

    //Begin getTier1Link function
    $(document).on('change', '#providerId', function(){

        var selectClient = $('#clientId').val();
        var selectProvider = $('#providerId').val();

        getTier1Link(selectClient, selectProvider, true);

    })
    //End getProviderId function
    

     /***** Begin add a new Tier2 form *****/
     $('#form-add-Tier2').on('submit', function (event) {

        event.preventDefault();

            $.ajax({
                url: $(this).attr('action'),
                method: 'post',
                timeout: 20000,
                data: {
                    _token: $(this).find('[name="_token"]').val(),
                    client_id: $(this).find('[name="clientId"]').val(),
                    provider_id: $(this).find('[name="providerId"]').val(),
                    tier1_link_id: $(this).find('[name="tier1Link"]').val(),
                    anchor_text: $(this).find('[name="anchorText"]').val(),
                    tier2_link: $(this).find('[name="tier2Link"]').val()
                },
                beforeSend: function () {

                    $(this).addClass('loading');

                },
                complete: function () {

                    $(this).removeClass('loading');

                },
                success: function (response) {

                    // Begin process response
                    if (response.success == true) {

                        var tier2 = response.data.tier2,

                        rowTemplate = '<tr class="tier2Item" data-tier2-id="{id}">\
                                            <td class="counterCell"></td>\
                                            <td>{client_id}</td>\
                                            <td>{provider_id}</td>\
                                            <td>{tier1_link_id}</td>\
                                            <td>{anchor_text}</td>\
                                            <td>{tier2_link}</td>\
                                            <td>\
                                                <div class="right floated content">\
                                                    <div class="ui tiny icon button teal show-edit-tier2-modal" data-toggle="modal" data-target="#editTier2">\
                                                        <i class="edit icon"></i>\
                                                    </div>\
                                                    <div class="ui tiny icon button red show-delete-tier2-modal" data-toggle="modal" data-target="#delete-tier2-modal">\
                                                        <i class="trash alternate outline icon"></i>\
                                                    </div>\
                                                </div>\
                                            </td>\
                                        </tr>';

                        rowTemplate = rowTemplate.replace(/{id}/g, tier2.id);
                        rowTemplate = rowTemplate.replace('{client_id}', tier2.client_id);
                        rowTemplate = rowTemplate.replace('{provider_id}', tier2.provider_id);
                        rowTemplate = rowTemplate.replace('{tier1_link_id}', tier2.tier1_link_id);
                        rowTemplate = rowTemplate.replace('{anchor_text}', tier2.anchor_text);
                        rowTemplate = rowTemplate.replace('{tier2_link}', tier2.tier2_link);

                        $('#tier2 tbody').append(rowTemplate);

                        $("#tier2Modal").modal("hide");

                    } else if (response.success == false) {

                        if (response.data.action == 'reloadPage') {

                            window.showCSRFModal();
                            return false;

                        }


                        // begin show messages
                        if (response.messages.length > 0) {

                            var $modal = $('#message-modal');

                            $modal.find('.content').text(response.messages[0]);
                            $modal.modal('show');

                        }
                        // end show messages

                    }
                    // End  process response

                },
                error: function (error) {

                    var $modal = $('#message-modal');

                    if (error.statusText == 'timeout') {
                        $modal.find('.content').text('The server does not respond');
                    } else {
                        $modal.find('.content').text('There was a problem, please try agian');
                    }

                    $modal.modal('show');

                }
            });

    });
    /***** End add a new Tier2 form *****/


     /***** Begin delete Tier2 *****/
     $(document).on('click', '.show-delete-tier2-modal', function (event) {

        event.preventDefault();

        var $modal = $('#delete-tier2-modal');
            $btn = $(this);
            $item = $btn.parents('.tier2Item');
            tier2Id = $item.attr('data-tier2-id');
            $message = $modal.find('.message');

            $('#form-remove-Tier2').unbind('submit').bind('submit', function (event) {

                event.preventDefault();

                $.ajax({
                    url: $(this).attr('action'),
                    method: 'post',
                    timeout: 20000,
                    data: {
                        _token: $(this).find('[name="_token"]').val(),
                        id: tier2Id,
                    },
                    beforeSend: function () {

                        $(this).addClass('loading');

                    },
                    complete: function () {

                        $(this).removeClass('loading');

                    },
                    success: function (response) {

                        // Begin process response
                        if (response.success == true) {

                            $item.remove();
                            // updatePagination();
                            // $modal.modal('hide');

                        } else if (response.success == false) {

                            if (response.data.action == 'reloadPage') {

                                window.showCSRFModal();
                                return false;

                            }


                            // begin show messages
                            if (response.messages.length > 0) {

                                var $modal = $('#message-modal');

                                $modal.find('.content').text(response.messages[0]);
                                $modal.modal('show');

                            }
                            // end show messages

                        }
                        // End  process response

                        $("#delete-tier2-modal").modal("hide");
                    },
                    error: function (error) {

                        var $modal = $('#message-modal');

                        if (error.statusText == 'timeout') {
                            $modal.find('.content').text('The server does not respond');
                        } else {
                            $modal.find('.content').text('There was a problem, please try agian');
                        }

                        $modal.modal('show');

                    }
                });
            });
    })
    /***** End delete Tier2 *****/


    /***** Begin edit Tier2 *****/
    $(document).on('click', '.show-edit-tier2-modal', function (event) {

    event.preventDefault();

    var $modal = $('#editTier2');

        $btn = $(this);
        $item = $btn.parents('.tier2Item');
        tier2Id = $item.attr('data-tier2-id');
        $message = $modal.find('.message');
        var $tier2Row = [];

        for( var $i = 0; $i< 5; $i++) {
            $tier2Row[$i] = $item.children("td:nth-child("+($i+2)+")").text();
        }

        $("#clientIdEdit").val($tier2Row[0]);
        
        getProviderId($tier2Row[0], false, $tier2Row[1]);        

        getTier1Link($tier2Row[0], $tier2Row[1], false, $tier2Row[2]);        

        $("#anchorTextEdit").val($tier2Row[3]);
        $("#tier2LinkEdit").val($tier2Row[4]);


        $('#formEditTier2').on('submit', function (event) {
            event.preventDefault();

            $.ajax({
                url: $(this).attr('action'),
                method: 'post',
                timeout: 20000,
                data: {
                    id: tier2Id,
                    client_id: $("#clientIdEdit").val(),
                    provider_id: $("#providerIdEdit").val(),
                    tier1_link_id: $("#tier1LinkEdit").val(),
                    anchor_text: $("#anchorTextEdit").val(),
                    tier2_link: $("#tier2LinkEdit").val(),
                    _token: $(this).find('[name="_token"]').val()
                },
                beforeSend: function () {

                    $(this).addClass('loading');

                },
                complete: function () {

                    $(this).removeClass('loading');

                },
                success: function (response) {

                    // Begin process response
                    if (response.success == true) {

                        $item.attr('data-tier2-id', response.data.tier2_id);
                        $item.children('td:nth-child(2)').text(response.data.client_id);
                        $item.children('td:nth-child(3)').text(response.data.provider_id);
                        $item.children('td:nth-child(4)').text(response.data.tier1_link_id);
                        $item.children('td:nth-child(5)').text(response.data.anchor_text);
                        $item.children('td:nth-child(6)').text(response.data.tier2_link);


                        $("#editTier2").modal("hide");

                    } else if (response.success == false) {

                        if (response.data.action == 'reloadPage') {

                            window.showCSRFModal();
                            return false;

                        }


                        // begin show messages
                        if (response.messages.length > 0) {

                            var $modal = $('#message-modal');

                            $modal.find('.content').text(response.messages[0]);
                            $modal.modal('show');

                        }
                        // end show messages

                    }
                    // End  process response

                },
                error: function (error) {

                    var $modal = $('#message-modal');

                    if (error.statusText == 'timeout') {
                        $modal.find('.content').text('The server does not respond');
                    } else {
                        $modal.find('.content').text('There was a problem, please try agian');
                    }

                    $modal.modal('show');

                }
            });
        });
    })
    /***** End edit Tier2 *****/


})
