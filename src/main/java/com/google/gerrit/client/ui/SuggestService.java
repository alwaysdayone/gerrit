// Copyright (C) 2008 The Android Open Source Project
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.gerrit.client.ui;

import com.google.gerrit.client.data.AccountInfo;
import com.google.gerrit.client.reviewdb.AccountGroup;
import com.google.gerrit.client.reviewdb.Project;
import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwtjsonrpc.client.RemoteJsonService;

import java.util.List;

public interface SuggestService extends RemoteJsonService {
  void suggestProjectNameKey(String query, int limit,
      AsyncCallback<List<Project.NameKey>> callback);

  void suggestAccount(String query, int limit,
      AsyncCallback<List<AccountInfo>> callback);

  void suggestAccountGroup(String query, int limit,
      AsyncCallback<List<AccountGroup>> callback);
}
