// Copyright (C) 2016 The Android Open Source Project
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

package com.google.gerrit.extensions.webui;

import com.google.gerrit.extensions.annotations.ExtensionPoint;
import com.google.gerrit.extensions.common.WebLinkInfo;

@ExtensionPoint
public interface ParentWebLink extends WebLink {

  /**
   * {@link com.google.gerrit.extensions.common.WebLinkInfo} describing a link from a parent
   * revision to an external service.
   *
   * <p>In order for the web link to be visible {@link
   * com.google.gerrit.extensions.common.WebLinkInfo#url} and {@link
   * com.google.gerrit.extensions.common.WebLinkInfo#name} must be set.
   *
   * <p>
   *
   * @param projectName name of the project
   * @param commit commit sha1 of the parent revision
   * @param commitMessage the commit messsage of the change
   * @param branchName target branch of the change
   * @return WebLinkInfo that links to parent commit in external service, null if there should be no
   *     link.
   */
  WebLinkInfo getParentWebLink(
      String projectName, String commit, String commitMessage, String branchName);
}
